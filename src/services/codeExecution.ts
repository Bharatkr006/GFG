import type { SupportedLanguage, ExecutionResult, TestCase, TestCaseResult, Verdict } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/problems';

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';
const EXECUTION_TIMEOUT_MS = 10000;

interface PistonResponse {
  language: string;
  version: string;
  run?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  compile?: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  message?: string;
}

function wrapWithDriverCode(language: SupportedLanguage, rawCode: string): string {
  if (language === 'cpp' || language === 'cpp20') {
    if (!rawCode.includes('main(')) {
      let driver = `#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\n${rawCode}\n\nint main() {\n  ios_base::sync_with_stdio(false);\n  cin.tie(NULL);\n`;
      if (rawCode.includes('minSubset')) {
        driver += `  int n; if (cin >> n) { vector<int> arr(n); for (int i = 0; i < n; i++) cin >> arr[i]; Solution sol; cout << sol.minSubset(arr) << "\\n"; }\n  return 0;\n}`;
        return driver;
      }
      if (rawCode.includes('insertInterval')) {
        driver += `  int n, ns, ne; if (cin >> n >> ns >> ne) { vector<vector<int>> inv(n, vector<int>(2)); for (int i = 0; i < n; i++) cin >> inv[i][0] >> inv[i][1]; vector<int> newInv = {ns, ne}; Solution sol; auto res = sol.insertInterval(inv, newInv); cout << "["; for (size_t i = 0; i < res.size(); i++) { cout << "[" << res[i][0] << ", " << res[i][1] << "]" << (i + 1 < res.size() ? ", " : ""); } cout << "]\\n"; }\n  return 0;\n}`;
        return driver;
      }
      if (rawCode.includes('subCount')) {
        driver += `  int n, k; if (cin >> n >> k) { vector<int> arr(n); for (int i = 0; i < n; i++) cin >> arr[i]; Solution sol; cout << sol.subCount(arr, k) << "\\n"; }\n  return 0;\n}`;
        return driver;
      }
      if (rawCode.includes('getMedian')) {
        driver += `  int n; if (cin >> n) { vector<int> arr(n); for (int i = 0; i < n; i++) cin >> arr[i]; Solution sol; auto res = sol.getMedian(arr); cout << "["; for (size_t i = 0; i < res.size(); i++) { cout << res[i] << (i + 1 < res.size() ? ", " : ""); } cout << "]\\n"; }\n  return 0;\n}`;
        return driver;
      }
      driver += `  return 0;\n}`;
      return driver;
    }
  }
  return rawCode;
}

/**
 * Execute code using public Piston API with fallback to Web Worker for JS
 */
export async function executeCode(
  language: SupportedLanguage,
  code: string,
  stdin: string
): Promise<{
  success: boolean;
  verdict: Verdict;
  stdout: string;
  stderr: string;
  compileOutput?: string;
  exitCode?: number;
  executionTimeMs?: number;
  isUnavailable?: boolean;
  errorMessage?: string;
}> {
  const langConfig = SUPPORTED_LANGUAGES.find(l => l.id === language);
  if (!langConfig) {
    return {
      success: false,
      verdict: 'Execution Unavailable',
      stdout: '',
      stderr: `Unsupported language: ${language}`,
      isUnavailable: true
    };
  }

  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), EXECUTION_TIMEOUT_MS);

    const fileName = language === 'java' ? 'Main.java' : `solution.${langConfig.extension}`;
    const executableCode = wrapWithDriverCode(language, code);

    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        language: langConfig.pistonLang,
        version: langConfig.pistonVersion === '*' ? undefined : langConfig.pistonVersion,
        files: [
          {
            name: fileName,
            content: executableCode
          }
        ],
        stdin: stdin,
        run_timeout: 4000,
        compile_timeout: 8000
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Piston execution rate limit reached. Please wait a few seconds and try again.');
      }
      const errText = await response.text();
      throw new Error(`Piston execution service returned HTTP ${response.status}: ${errText.slice(0, 200)}`);
    }

    const data: PistonResponse = await response.json();
    const duration = Math.round(performance.now() - startTime);

    // Check for compilation failure
    if (data.compile && data.compile.code !== 0) {
      return {
        success: false,
        verdict: 'Compilation Error',
        stdout: data.compile.stdout || '',
        stderr: data.compile.stderr || data.compile.output || 'Compilation failed',
        compileOutput: data.compile.output || data.compile.stderr,
        exitCode: data.compile.code,
        executionTimeMs: duration
      };
    }

    if (data.run) {
      const exitCode = data.run.code;
      const isRuntimeError = exitCode !== 0 || data.run.signal !== null;
      return {
        success: !isRuntimeError,
        verdict: isRuntimeError ? 'Runtime Error' : 'Accepted',
        stdout: data.run.stdout || '',
        stderr: data.run.stderr || (isRuntimeError ? `Process exited with code ${exitCode}` : ''),
        exitCode: exitCode,
        executionTimeMs: duration
      };
    }

    return {
      success: false,
      verdict: 'Execution Unavailable',
      stdout: '',
      stderr: data.message || 'No execution output received from runner',
      isUnavailable: true
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);

    // If JavaScript and Piston failed, attempt restricted Web Worker execution
    if (language === 'javascript') {
      try {
        const workerResult = await executeJavaScriptWorker(code, stdin);
        const duration = Math.round(performance.now() - startTime);
        return {
          ...workerResult,
          executionTimeMs: duration
        };
      } catch (workerErr: unknown) {
        return {
          success: false,
          verdict: 'Runtime Error',
          stdout: '',
          stderr: `Web Worker Execution Error: ${workerErr instanceof Error ? workerErr.message : String(workerErr)}`,
          executionTimeMs: Math.round(performance.now() - startTime)
        };
      }
    }

    // Remote service unavailable
    return {
      success: false,
      verdict: 'Execution Unavailable',
      stdout: '',
      stderr: `Execution service is unavailable: ${errorMsg}.\n(Remote execution requires an active connection to the Piston execution API at emkc.org)`,
      isUnavailable: true,
      errorMessage: errorMsg
    };
  }
}

/**
 * Execute JavaScript in a safe, sandboxed Web Worker with timeout
 */
function executeJavaScriptWorker(
  code: string,
  stdin: string
): Promise<{
  success: boolean;
  verdict: Verdict;
  stdout: string;
  stderr: string;
  exitCode: number;
}> {
  return new Promise((resolve) => {
    // Worker script that mocks fs.readFileSync for competitive programming solutions
    const workerScript = `
      self.onmessage = function(e) {
        const { code, stdin } = e.data;
        let logs = [];
        let errors = [];

        // Mock console.log
        const originalLog = console.log;
        const originalError = console.error;
        console.log = function(...args) {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        console.error = function(...args) {
          errors.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };

        // Mock node fs module for stdin reading
        const mockFs = {
          readFileSync: function() {
            return stdin;
          }
        };

        // Function wrapper
        try {
          const fn = new Function('require', 'console', code);
          const mockRequire = function(module) {
            if (module === 'fs') return mockFs;
            throw new Error('Module ' + module + ' is not allowed in sandbox');
          };

          fn(mockRequire, console);
          self.postMessage({
            success: true,
            stdout: logs.join('\\n'),
            stderr: errors.join('\\n'),
            exitCode: 0
          });
        } catch (err) {
          self.postMessage({
            success: false,
            stdout: logs.join('\\n'),
            stderr: err.toString(),
            exitCode: 1
          });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        resolve({
          success: false,
          verdict: 'Time Limit Exceeded',
          stdout: '',
          stderr: 'Time Limit Exceeded (Worker timed out after 3000ms)',
          exitCode: 124
        });
      }
    }, 3500);

    worker.onmessage = (event) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        const { success, stdout, stderr, exitCode } = event.data;
        resolve({
          success,
          verdict: success ? 'Accepted' : 'Runtime Error',
          stdout: stdout || '',
          stderr: stderr || '',
          exitCode: exitCode || 0
        });
      }
    };

    worker.onerror = (err) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        resolve({
          success: false,
          verdict: 'Runtime Error',
          stdout: '',
          stderr: err.message || 'Worker runtime error',
          exitCode: 1
        });
      }
    };

    worker.postMessage({ code, stdin });
  });
}

function normalizeOutput(output: string): string {
  return output
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Run code with custom input
 */
export async function runCustomInput(
  language: SupportedLanguage,
  code: string,
  customInput: string
): Promise<ExecutionResult> {
  const result = await executeCode(language, code, customInput);

  return {
    type: 'run',
    verdict: result.verdict,
    stdout: result.stdout,
    stderr: result.stderr,
    compileOutput: result.compileOutput,
    exitCode: result.exitCode,
    executionTimeMs: result.executionTimeMs,
    rawMessage: result.errorMessage
  };
}

/**
 * Submit code against all problem test cases (sample + hidden)
 */
export async function submitSolution(
  language: SupportedLanguage,
  code: string,
  testCases: TestCase[]
): Promise<ExecutionResult> {
  if (!code.trim()) {
    return {
      type: 'submit',
      verdict: 'Compilation Error',
      stderr: 'Submission code is empty. Please write your solution before submitting.',
      totalTestCases: testCases.length,
      testCasesPassed: 0
    };
  }

  const testCaseResults: TestCaseResult[] = [];
  let passedCount = 0;
  let overallVerdict: Verdict = 'Accepted';
  let totalTime = 0;
  let compileErr = '';

  for (const tc of testCases) {
    const execResult = await executeCode(language, code, tc.input);

    if (execResult.isUnavailable) {
      return {
        type: 'submit',
        verdict: 'Execution Unavailable',
        stderr: execResult.stderr,
        rawMessage: execResult.errorMessage,
        totalTestCases: testCases.length,
        testCasesPassed: 0
      };
    }

    if (execResult.verdict === 'Compilation Error') {
      return {
        type: 'submit',
        verdict: 'Compilation Error',
        compileOutput: execResult.compileOutput,
        stderr: execResult.stderr,
        totalTestCases: testCases.length,
        testCasesPassed: 0
      };
    }

    totalTime += execResult.executionTimeMs || 0;

    const actualNormalized = normalizeOutput(execResult.stdout);
    const expectedNormalized = normalizeOutput(tc.expectedOutput);
    const passed = execResult.success && actualNormalized === expectedNormalized;

    if (passed) {
      passedCount++;
    } else if (overallVerdict === 'Accepted') {
      if (execResult.verdict === 'Runtime Error') {
        overallVerdict = 'Runtime Error';
      } else if (execResult.verdict === 'Time Limit Exceeded') {
        overallVerdict = 'Time Limit Exceeded';
      } else {
        overallVerdict = 'Wrong Answer';
      }
    }

    testCaseResults.push({
      testCaseId: tc.id,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: execResult.stdout,
      passed,
      error: execResult.stderr,
      executionTimeMs: execResult.executionTimeMs
    });
  }

  if (passedCount < testCases.length && overallVerdict === 'Accepted') {
    overallVerdict = 'Wrong Answer';
  }

  return {
    type: 'submit',
    verdict: overallVerdict,
    testCasesPassed: passedCount,
    totalTestCases: testCases.length,
    testCaseResults,
    executionTimeMs: Math.round(totalTime / testCases.length),
    compileOutput: compileErr
  };
}
