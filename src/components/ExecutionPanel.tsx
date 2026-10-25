import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Terminal,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
  Check
} from 'lucide-react';
import type { ExecutionResult, TestCase } from '../types';

interface ExecutionPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  sampleTestCases?: TestCase[];
}

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  result,
  isRunning,
  isSubmitting,
  onClose,
  sampleTestCases: _sampleTestCases
}) => {
  const [activeTab, setActiveTab] = useState<'verdict' | 'testcases' | 'terminal'>('verdict');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isRunning && !isSubmitting && !result) {
    return null;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`border-t border-[#262C2C] bg-[#141A1A] flex flex-col transition-all duration-200 z-20 ${
        isMinimized ? 'h-9' : 'h-72 max-h-[50vh]'
      }`}
    >
      {/* Panel Header */}
      <div className="h-9 px-4 bg-[#182020] border-b border-[#262C2C] flex items-center justify-between shrink-0 select-none text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <Terminal className="w-3.5 h-3.5 text-[#3FB950]" />
            <span>Execution Console</span>
          </div>

          {/* Quick status pill */}
          {isRunning && (
            <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Compiling & Running...
            </span>
          )}

          {isSubmitting && (
            <span className="text-[11px] text-[#3FB950] bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-ping" />
              Validating Test Cases...
            </span>
          )}

          {result && !isRunning && !isSubmitting && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 border ${
                result.verdict === 'Accepted'
                  ? 'bg-emerald-950/60 border-emerald-800 text-[#3FB950]'
                  : result.verdict === 'Wrong Answer'
                  ? 'bg-red-950/60 border-red-800 text-[#F85149]'
                  : 'bg-amber-950/60 border-amber-800 text-amber-400'
              }`}
            >
              {result.verdict === 'Accepted' && <CheckCircle2 className="w-3 h-3" />}
              {result.verdict === 'Wrong Answer' && <XCircle className="w-3 h-3" />}
              {result.verdict !== 'Accepted' && result.verdict !== 'Wrong Answer' && (
                <AlertTriangle className="w-3 h-3" />
              )}
              <span>{result.verdict}</span>
              {result.totalTestCases !== undefined && (
                <span>
                  ({result.testCasesPassed}/{result.totalTestCases})
                </span>
              )}
            </span>
          )}
        </div>

        {/* Panel controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded text-[#8B98A7] hover:text-white hover:bg-[#161F2B]"
            title={isMinimized ? 'Expand console' : 'Minimize console'}
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8B98A7] hover:text-white hover:bg-[#161F2B]"
            title="Close console"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* If Minimized, skip body */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0B0F14]">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between px-4 border-b border-[#202B37] bg-[#0E151E] h-8 shrink-0">
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setActiveTab('verdict')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'verdict'
                    ? 'bg-[#161F2B] text-white font-medium border border-[#26313D]'
                    : 'text-[#8B98A7] hover:text-white'
                }`}
              >
                Verdict Summary
              </button>

              {result?.testCaseResults && result.testCaseResults.length > 0 && (
                <button
                  onClick={() => setActiveTab('testcases')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'testcases'
                      ? 'bg-[#161F2B] text-white font-medium border border-[#26313D]'
                      : 'text-[#8B98A7] hover:text-white'
                  }`}
                >
                  Test Results ({result.testCasesPassed}/{result.totalTestCases})
                </button>
              )}

              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'terminal'
                    ? 'bg-[#161F2B] text-white font-medium border border-[#26313D]'
                    : 'text-[#8B98A7] hover:text-white'
                }`}
              >
                Output & Logs
              </button>
            </div>

            {result?.executionTimeMs !== undefined && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#8B98A7]">
                <Clock className="w-3 h-3" />
                <span>{result.executionTimeMs} ms</span>
              </div>
            )}
          </div>

          {/* Panel Body Content */}
          <div className="flex-1 overflow-auto p-4 text-xs font-mono">
            {/* Loading state */}
            {(isRunning || isSubmitting) && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-[#8B98A7]">
                <div className="w-6 h-6 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-sans">
                  {isSubmitting
                    ? 'Executing code across all evaluation test cases...'
                    : 'Transmitting source code to compiler runner...'}
                </p>
              </div>
            )}

            {/* Verdict Tab */}
            {!isRunning && !isSubmitting && activeTab === 'verdict' && result && (
              <div className="space-y-4">
                <div
                  className={`p-3.5 rounded-md border flex items-start justify-between ${
                    result.verdict === 'Accepted'
                      ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                      : result.verdict === 'Wrong Answer'
                      ? 'bg-red-950/30 border-red-800/80 text-red-200'
                      : 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      {result.verdict === 'Accepted' && <CheckCircle2 className="w-4 h-4 text-[#3FB950]" />}
                      {result.verdict === 'Wrong Answer' && <XCircle className="w-4 h-4 text-[#F85149]" />}
                      {result.verdict !== 'Accepted' && result.verdict !== 'Wrong Answer' && (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      <span>Verdict: {result.verdict}</span>
                    </h3>
                    <p className="font-sans text-xs mt-1 text-[#8B98A7]">
                      {result.verdict === 'Accepted' &&
                        'Congratulations! Your code passed all test cases with optimal constraints.'}
                      {result.verdict === 'Wrong Answer' &&
                        'Your code produced an incorrect answer on one or more test cases.'}
                      {result.verdict === 'Compilation Error' &&
                        'Compiler failed to build your source code. Review syntax diagnostics below.'}
                      {result.verdict === 'Runtime Error' &&
                        'An unexpected exception, segmentation fault, or non-zero exit code occurred.'}
                      {result.verdict === 'Execution Unavailable' &&
                        'The remote execution runner (Piston API) was unreachable or rate-limited.'}
                    </p>
                  </div>

                  {result.totalTestCases !== undefined && (
                    <div className="text-right font-mono">
                      <div className="text-lg font-bold text-white">
                        {result.testCasesPassed} / {result.totalTestCases}
                      </div>
                      <div className="text-[10px] text-[#8B98A7]">Test Cases Passed</div>
                    </div>
                  )}
                </div>

                {/* Stdout / Stderr preview */}
                {result.stdout && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[#8B98A7] text-[11px]">
                      <span>Program Output:</span>
                      <button
                        onClick={() => handleCopy(result.stdout || '')}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        {copied ? <Check className="w-3 h-3 text-[#3FB950]" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-2.5 bg-[#161F2B] border border-[#26313D] rounded text-[#3FB950] overflow-x-auto whitespace-pre">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {(result.stderr || result.compileOutput) && (
                  <div className="space-y-1">
                    <span className="text-red-400 text-[11px] font-semibold">Compiler / Error Logs:</span>
                    <pre className="p-2.5 bg-red-950/20 border border-red-800/60 rounded text-[#F85149] overflow-x-auto whitespace-pre">
                      {result.compileOutput || result.stderr}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Test Cases Tab */}
            {!isRunning && !isSubmitting && activeTab === 'testcases' && result?.testCaseResults && (
              <div className="space-y-3">
                {/* Test case selector pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {result.testCaseResults.map((tc, idx) => (
                    <button
                      key={tc.testCaseId}
                      onClick={() => setSelectedTestCaseIndex(idx)}
                      className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
                        selectedTestCaseIndex === idx
                          ? 'bg-[#161F2B] border border-[#3FB950] text-white font-bold'
                          : 'bg-[#111820] border border-[#26313D] text-[#8B98A7] hover:text-white'
                      }`}
                    >
                      {tc.passed ? (
                        <CheckCircle2 className="w-3 h-3 text-[#3FB950]" />
                      ) : (
                        <XCircle className="w-3 h-3 text-[#F85149]" />
                      )}
                      <span>Case {idx + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Test Case Details */}
                {result.testCaseResults[selectedTestCaseIndex] && (
                  <div className="space-y-3 bg-[#111820] p-3 rounded-md border border-[#26313D]">
                    <div>
                      <span className="text-[11px] text-[#8B98A7] block mb-1">Input:</span>
                      <pre className="p-2 bg-[#0B0F14] rounded border border-[#202B37] text-[#E6EDF3] overflow-x-auto whitespace-pre">
                        {result.testCaseResults[selectedTestCaseIndex].input}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-[#8B98A7] block mb-1">Expected Output:</span>
                        <pre className="p-2 bg-[#0B0F14] rounded border border-[#202B37] text-[#3FB950] overflow-x-auto whitespace-pre">
                          {result.testCaseResults[selectedTestCaseIndex].expected}
                        </pre>
                      </div>

                      <div>
                        <span className="text-[11px] text-[#8B98A7] block mb-1">Your Output:</span>
                        <pre
                          className={`p-2 bg-[#0B0F14] rounded border overflow-x-auto whitespace-pre ${
                            result.testCaseResults[selectedTestCaseIndex].passed
                              ? 'border-[#202B37] text-[#3FB950]'
                              : 'border-red-900/60 text-[#F85149]'
                          }`}
                        >
                          {result.testCaseResults[selectedTestCaseIndex].actual || '(Empty Output)'}
                        </pre>
                      </div>
                    </div>

                    {result.testCaseResults[selectedTestCaseIndex].error && (
                      <div>
                        <span className="text-[11px] text-red-400 block mb-1">Error Stream:</span>
                        <pre className="p-2 bg-red-950/20 rounded border border-red-800/40 text-red-300 text-xs overflow-x-auto whitespace-pre">
                          {result.testCaseResults[selectedTestCaseIndex].error}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Terminal Tab */}
            {!isRunning && !isSubmitting && activeTab === 'terminal' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[#8B98A7] text-[11px]">
                  <span>Raw Process Standard Output & Logs</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `${result?.stdout || ''}\n${result?.stderr || ''}\n${result?.compileOutput || ''}`
                      )
                    }
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#3FB950]" /> : <Copy className="w-3 h-3" />}
                    <span>Copy All</span>
                  </button>
                </div>

                <div className="p-3 bg-[#080B0F] border border-[#202B37] rounded font-mono text-xs text-[#E6EDF3] overflow-auto max-h-48 whitespace-pre">
                  {result ? (
                    <>
                      {result.stdout && (
                        <div className="text-[#3FB950]">{result.stdout}</div>
                      )}
                      {result.compileOutput && (
                        <div className="text-amber-400 mt-2">{result.compileOutput}</div>
                      )}
                      {result.stderr && (
                        <div className="text-[#F85149] mt-2">{result.stderr}</div>
                      )}
                      {!result.stdout && !result.stderr && !result.compileOutput && (
                        <div className="text-[#6E7D8F]">Process finished with no console output.</div>
                      )}
                    </>
                  ) : (
                    <div className="text-[#6E7D8F]">No run logs available.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
