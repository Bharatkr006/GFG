import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { PROBLEMS, SUPPORTED_LANGUAGES } from '../data/problems';
import type { SupportedLanguage, ExecutionResult, SubmissionRecord, Problem } from '../types';
import { storage } from '../utils/storage';
import { runCustomInput, submitSolution } from '../services/codeExecution';
import { Header } from '../components/Header';
import { ProblemPanel } from '../components/ProblemPanel';
import { ProblemDrawer } from '../components/ProblemDrawer';
import { ResizablePanels } from '../components/ResizablePanels';
import { EditorToolbar } from '../components/EditorToolbar';
import { CodeEditor } from '../components/CodeEditor';
import { ExecutionPanel } from '../components/ExecutionPanel';
import { CustomInputModal } from '../components/CustomInputModal';

export const ContestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find active problem or default to problem 1
  const activeProblem: Problem =
    PROBLEMS.find((p) => p.id === id || p.slug === id) || PROBLEMS[0];

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Editor State
  const [language, setLanguage] = useState<SupportedLanguage>('cpp');
  const [fontSize, setFontSize] = useState<number>(() => storage.getFontSize() || 13);
  const [editorTheme, setEditorTheme] = useState<string>(() => storage.getEditorTheme() || 'vs-dark');
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  // Load code draft for active problem & language
  const [code, setCode] = useState<string>(() => {
    const defaultTemplate = activeProblem.starterTemplates[language] || '';
    return storage.getCodeDraft(activeProblem.id, language, defaultTemplate);
  });

  // Custom Input State
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState<string>(() => {
    return storage.getCustomInput(activeProblem.id, activeProblem.examples[0]?.input || '');
  });

  // Execution & Submission State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => storage.getSubmissions());

  // Update code when problem or language changes
  useEffect(() => {
    const defaultTemplate = activeProblem.starterTemplates[language] || '';
    const draft = storage.getCodeDraft(activeProblem.id, language, defaultTemplate);
    setCode(draft);

    const savedInput = storage.getCustomInput(
      activeProblem.id,
      activeProblem.examples[0]?.input || ''
    );
    setCustomInput(savedInput);
    setExecutionResult(null);
  }, [activeProblem.id, language]);

  // Handle Code Change with auto-save to LocalStorage
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    storage.saveCodeDraft(activeProblem.id, language, newCode);
  };

  // Handle Language Change
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const defaultTemplate = activeProblem.starterTemplates[newLang] || '';
    const draft = storage.getCodeDraft(activeProblem.id, newLang, defaultTemplate);
    setCode(draft);
  };

  // Reset code to initial template
  const handleResetCode = () => {
    const defaultTemplate = activeProblem.starterTemplates[language] || '';
    storage.clearCodeDraft(activeProblem.id, language);
    setCode(defaultTemplate);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  // Download code as file
  const handleDownloadCode = () => {
    const langConfig = SUPPORTED_LANGUAGES.find((l) => l.id === language);
    const ext = langConfig ? langConfig.extension : 'txt';
    const filename = `${activeProblem.slug}.${ext}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Font size change
  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    storage.saveFontSize(size);
  };

  // Editor Theme Toggle
  const handleToggleTheme = () => {
    const newTheme = editorTheme === 'vs-dark' ? 'light' : 'vs-dark';
    setEditorTheme(newTheme);
    storage.saveEditorTheme(newTheme);
  };

  // Custom Input Change
  const handleCustomInputChange = (val: string) => {
    setCustomInput(val);
    storage.saveCustomInput(activeProblem.id, val);
  };

  // Select problem from drawer
  const handleSelectProblem = (problemId: string) => {
    navigate(`/problems/${problemId}`);
  };

  // Compile & Run handler
  const handleCompileAndRun = async () => {
    if (isRunning || isSubmitting) return;

    setIsRunning(true);
    setExecutionResult(null);

    const inputToUse = useCustomInput
      ? customInput
      : activeProblem.examples[0]?.input || '';

    try {
      const result = await runCustomInput(language, code, inputToUse);
      setExecutionResult(result);
    } catch (err: unknown) {
      setExecutionResult({
        type: 'run',
        verdict: 'Runtime Error',
        stderr: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution handler
  const handleSubmitSolution = async () => {
    if (isRunning || isSubmitting) return;

    setIsSubmitting(true);
    setExecutionResult(null);

    try {
      const result = await submitSolution(language, code, activeProblem.testCases);
      setExecutionResult(result);

      // Record submission in LocalStorage
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.id === language);
      const submissionRecord: SubmissionRecord = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        language: language,
        languageLabel: langConfig ? langConfig.label : language,
        code: code,
        verdict: result.verdict,
        testCasesPassed: result.testCasesPassed || 0,
        totalTestCases: result.totalTestCases || activeProblem.testCases.length,
        runtime: result.executionTimeMs ? `${result.executionTimeMs} ms` : '12 ms',
        submittedAt: new Date().toISOString(),
        errorMessage: result.compileOutput || result.stderr
      };

      storage.saveSubmission(submissionRecord);
      setSubmissions(storage.getSubmissions());
    } catch (err: unknown) {
      setExecutionResult({
        type: 'submit',
        verdict: 'Runtime Error',
        stderr: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#080D0D] overflow-hidden select-none">
      {/* Top Workspace Header */}
      <Header />

      {/* Problem Drawer Overlay */}
      <ProblemDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        problems={PROBLEMS}
        activeProblemId={activeProblem.id}
        onSelectProblem={handleSelectProblem}
      />

      {/* Main Split Panels */}
      <div className="flex-1 w-full overflow-hidden flex flex-col">
        <ResizablePanels
          isEditorFullscreen={isEditorFullscreen}
          leftContent={
            <ProblemPanel
              problem={activeProblem}
              onOpenDrawer={() => setIsDrawerOpen(true)}
              submissions={submissions}
            />
          }
          rightContent={
            <div className="flex flex-col h-full w-full bg-[#111111] overflow-hidden">
              {/* Editor Toolbar */}
              <EditorToolbar
                language={language}
                onLanguageChange={handleLanguageChange}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                onResetCode={handleResetCode}
                onCopyCode={handleCopyCode}
                onDownloadCode={handleDownloadCode}
                isFullscreen={isEditorFullscreen}
                onToggleFullscreen={() => setIsEditorFullscreen(!isEditorFullscreen)}
                editorTheme={editorTheme}
                onToggleTheme={handleToggleTheme}
              />

              {/* Monaco Code Editor */}
              <div className="flex-1 min-h-0 relative bg-[#0D0D0D]">
                <CodeEditor
                  code={code}
                  language={language}
                  fontSize={fontSize}
                  theme={editorTheme}
                  onChange={handleCodeChange}
                />
              </div>

              {/* Execution Panel (Drawer / Output view) */}
              <ExecutionPanel
                result={executionResult}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                onClose={() => setExecutionResult(null)}
                sampleTestCases={activeProblem.testCases.filter((tc) => tc.isSample)}
              />

              {/* Bottom Action Bar */}
              <div className="h-11 bg-[#141414] border-t border-[#262626] px-4 flex items-center justify-between shrink-0 select-none">
                {/* Left: Sun / Light Theme icon in subtle square button */}
                <div className="flex items-center">
                  <button
                    onClick={handleToggleTheme}
                    className="w-7 h-7 rounded border border-[#3A3A3A] bg-[#222222] flex items-center justify-center text-[#888888] hover:text-white transition-colors cursor-pointer"
                    title="Editor Theme"
                  >
                    {editorTheme === 'vs-dark' ? (
                      <Sun className="w-3.5 h-3.5" />
                    ) : (
                      <Moon className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Right: Custom Input, Compile & Run, Submit */}
                <div className="flex items-center gap-2.5">
                  {/* Custom Input */}
                  <button
                    onClick={() => setIsCustomInputOpen(true)}
                    className={`text-xs font-medium px-2 py-1 transition-colors cursor-pointer ${
                      useCustomInput
                        ? 'text-[#2BA84A] font-semibold'
                        : 'text-[#999999] hover:text-white'
                    }`}
                    title="Provide custom input"
                  >
                    Custom Input
                  </button>

                  {/* Compile & Run */}
                  <button
                    disabled={isRunning || isSubmitting}
                    onClick={handleCompileAndRun}
                    className="px-4 py-1.5 rounded-md bg-[#282828] hover:bg-[#333333] border border-[#404040] text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                    title="Compile and run code"
                  >
                    {isRunning ? 'Running...' : 'Compile & Run'}
                  </button>

                  {/* Submit */}
                  <button
                    disabled={isRunning || isSubmitting}
                    onClick={handleSubmitSolution}
                    className="px-6 py-1.5 rounded-md bg-[#2F914B] hover:bg-[#288042] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                    title="Submit solution"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* Custom Input Modal */}
      <CustomInputModal
        isOpen={isCustomInputOpen}
        onClose={() => setIsCustomInputOpen(false)}
        customInput={customInput}
        onChange={handleCustomInputChange}
        useCustomInput={useCustomInput}
        onToggleUseCustomInput={setUseCustomInput}
        defaultInput={activeProblem.examples[0]?.input || ''}
      />
    </div>
  );
};
