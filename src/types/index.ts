export type SupportedLanguage = 'cpp' | 'cpp20' | 'python' | 'java' | 'javascript';

export interface LanguageConfig {
  id: SupportedLanguage;
  label: string;
  monacoLang: string;
  pistonLang: string;
  pistonVersion: string;
  extension: string;
}

export interface ExampleCase {
  id: number;
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  explanation?: string;
}

export interface Problem {
  id: string;
  slug: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  accuracy: string;
  submissionsCount: string;
  points: number;
  maxMarks: number;
  descriptionHtml: string;
  descriptionText: string;
  examples: ExampleCase[];
  moreExamples?: ExampleCase[];
  constraints: string[];
  editorial?: {
    approach: string;
    algorithm: string;
    timeComplexity: string;
    spaceComplexity: string;
  };
  testCases: TestCase[];
  starterTemplates: Record<SupportedLanguage, string>;
}

export interface TestCaseResult {
  testCaseId: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
  executionTimeMs?: number;
}

export type Verdict =
  | 'Accepted'
  | 'Wrong Answer'
  | 'Compilation Error'
  | 'Runtime Error'
  | 'Time Limit Exceeded'
  | 'Execution Unavailable'
  | 'Pending';

export interface ExecutionResult {
  type: 'run' | 'submit';
  verdict: Verdict;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  exitCode?: number;
  executionTimeMs?: number;
  memoryKb?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  testCaseResults?: TestCaseResult[];
  rawMessage?: string;
}

export interface SubmissionRecord {
  id: string;
  problemId: string;
  problemTitle: string;
  language: SupportedLanguage;
  languageLabel: string;
  code: string;
  verdict: Verdict;
  testCasesPassed: number;
  totalTestCases: number;
  runtime?: string;
  memory?: string;
  submittedAt: string;
  errorMessage?: string;
}

export interface ContestConfig {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
}
