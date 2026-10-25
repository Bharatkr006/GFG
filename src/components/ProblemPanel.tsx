import React, { useState } from 'react';
import {
  Menu,
  Code2,
  BookOpen,
  Clock,
  Maximize2,
  Bug,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import type { Problem, SubmissionRecord } from '../types';

interface ProblemPanelProps {
  problem: Problem;
  onOpenDrawer: () => void;
  submissions: SubmissionRecord[];
}

export const ProblemPanel: React.FC<ProblemPanelProps> = ({
  problem,
  onOpenDrawer,
  submissions
}) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'editorial' | 'submissions'>('problem');
  const [showMoreExamples, setShowMoreExamples] = useState(false);
  const [showBugModal, setShowBugModal] = useState(false);
  const [bugSubmitted, setBugSubmitted] = useState(false);
  const [selectedSubmissionCode, setSelectedSubmissionCode] = useState<SubmissionRecord | null>(null);

  const problemSubmissions = submissions.filter((s) => s.problemId === problem.id);

  return (
    <div className="flex flex-col h-full bg-[#090E0E] text-[#F1F1F1] select-text overflow-hidden">
      {/* Secondary Left Toolbar */}
      <div className="h-11 bg-[#242424] border-b border-[#333333] px-3 flex items-center justify-between shrink-0 select-none">
        {/* Left items: Hamburger Menu, Problem tab, Editorial tab, Submissions tab */}
        <div className="flex items-center space-x-1 h-full">
          {/* Hamburger button to open Problem Navigation Drawer */}
          <button
            onClick={onOpenDrawer}
            className="p-1.5 mr-1 text-[#A0A0A0] hover:text-white hover:bg-[#333333] rounded transition-colors cursor-pointer"
            title="Open Problem Drawer"
            aria-label="Open Problem Drawer"
          >
            <Menu className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Problem Tab */}
          <button
            onClick={() => setActiveTab('problem')}
            className={`h-full px-3.5 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'problem'
                ? 'border-[#2BA84A] text-[#2BA84A]'
                : 'border-transparent text-[#A0A0A0] hover:text-[#F1F1F1]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Problem</span>
          </button>

          {/* Editorial Tab */}
          <button
            onClick={() => setActiveTab('editorial')}
            className={`h-full px-3.5 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'editorial'
                ? 'border-[#2BA84A] text-[#2BA84A]'
                : 'border-transparent text-[#A0A0A0] hover:text-[#F1F1F1]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Editorial</span>
          </button>

          {/* Submissions Tab */}
          <button
            onClick={() => setActiveTab('submissions')}
            className={`h-full px-3.5 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 ${
              activeTab === 'submissions'
                ? 'border-[#2BA84A] text-[#2BA84A]'
                : 'border-transparent text-[#A0A0A0] hover:text-[#F1F1F1]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Submissions</span>
            {problemSubmissions.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#16231A] text-[#2BA84A] border border-[#2BA84A]/30">
                {problemSubmissions.length}
              </span>
            )}
          </button>
        </div>

        {/* Right item: Fullscreen Left Panel */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }
          }}
          className="p-1.5 text-[#A0A0A0] hover:text-white hover:bg-[#333333] rounded transition-colors cursor-pointer"
          title="Fullscreen Problem View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Panel Content Area (Independently scrollable) */}
      <div className="flex-1 overflow-y-auto px-8 sm:px-10 py-7">
        {activeTab === 'problem' && (
          <div className="space-y-4 max-w-3xl">
            {/* Title Row with Bug Report Icon */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl sm:text-[22px] font-bold text-[#F1F1F1] tracking-tight">
                {problem.title}
              </h1>

              <button
                onClick={() => setShowBugModal(true)}
                className="p-1.5 text-[#8A8A8A] hover:text-[#F1F1F1] transition-colors rounded hover:bg-[#1E2424] cursor-pointer"
                title="Report issue or feedback"
                aria-label="Report issue"
              >
                <Bug className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata Line: Accuracy, Submissions, Points */}
            <div className="flex items-center gap-5 text-xs text-[#8A8A8A]">
              <span>
                <strong className="text-[#A0A0A0] font-medium">Accuracy:</strong> {problem.accuracy}
              </span>
              <span>
                <strong className="text-[#A0A0A0] font-medium">Submissions:</strong> {problem.submissionsCount}
              </span>
              <span>
                <strong className="text-[#A0A0A0] font-medium">Points:</strong> {problem.points}
              </span>
            </div>

            {/* Subtle Divider */}
            <div className="h-px bg-[#262C2C] my-3" />

            {/* Problem Statement */}
            <div
              className="text-[15px] text-[#E0E0E0] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: problem.descriptionHtml }}
            />

            {/* Examples Heading */}
            <div className="pt-2">
              <h2 className="text-[15px] font-bold text-[#F1F1F1] mb-3">Examples:</h2>

              {/* Example Blocks */}
              <div className="space-y-3.5">
                {problem.examples.map((example) => (
                  <div
                    key={example.id}
                    className="bg-[#252525] border border-[#3A3A3A] rounded-md p-4 text-[14px] font-sans space-y-1.5"
                  >
                    <div>
                      <span className="font-bold text-white">Input: </span>
                      <span className="text-[#D8D8D8] font-mono text-[13px]">{example.input}</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">Output: </span>
                      <span className="text-[#D8D8D8] font-mono text-[13px]">{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div className="pt-0.5">
                        <span className="font-bold text-white">Explanation: </span>
                        <span className="text-[#C0C0C0] leading-relaxed whitespace-pre-line">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Additional / Hidden Examples */}
                {showMoreExamples &&
                  problem.moreExamples?.map((example) => (
                    <div
                      key={example.id}
                      className="bg-[#252525] border border-[#3A3A3A] rounded-md p-4 text-[14px] font-sans space-y-1.5 animate-in fade-in duration-150"
                    >
                      <div>
                        <span className="font-bold text-white">Input: </span>
                        <span className="text-[#D8D8D8] font-mono text-[13px]">{example.input}</span>
                      </div>
                      <div>
                        <span className="font-bold text-white">Output: </span>
                        <span className="text-[#D8D8D8] font-mono text-[13px]">{example.output}</span>
                      </div>
                      {example.explanation && (
                        <div className="pt-0.5">
                          <span className="font-bold text-white">Explanation: </span>
                          <span className="text-[#C0C0C0] leading-relaxed whitespace-pre-line">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {/* Try More Examples Button */}
              {problem.moreExamples && problem.moreExamples.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowMoreExamples(!showMoreExamples)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#2BA84A] hover:underline cursor-pointer"
                  >
                    <span>{showMoreExamples ? 'Show Less Examples' : 'Try More Examples'}</span>
                    {showMoreExamples ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Constraints */}
            <div className="pt-4">
              <h2 className="text-[15px] font-bold text-[#F1F1F1] mb-2.5">Constraints:</h2>
              <div className="space-y-1 text-[14px] font-mono text-[#C0C0C0]">
                {problem.constraints.map((constraint, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8A8A8A]" />
                    <span>{constraint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editorial Tab */}
        {activeTab === 'editorial' && (
          <div className="space-y-5 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Editorial & Approach</h2>
              <p className="text-xs text-[#8A8A8A]">
                Comprehensive algorithmic strategy and complexity breakdown.
              </p>
            </div>

            <div className="bg-[#141A1A] border border-[#2A3434] rounded-lg p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#2BA84A] uppercase tracking-wider block mb-1">
                  Approach
                </span>
                <h3 className="text-base font-bold text-white">
                  {problem.editorial?.approach || 'Standard Optimal Solution'}
                </h3>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#2BA84A] uppercase tracking-wider block mb-1">
                  Algorithm
                </span>
                <p className="text-[14px] text-[#D0D0D0] leading-relaxed">
                  {problem.editorial?.algorithm ||
                    'Formulate the optimal greedy or dynamic programming transition to process elements efficiently.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-[#1E2626] p-3 rounded border border-[#2E3A3A]">
                  <span className="text-xs text-[#8A8A8A] block">Time Complexity</span>
                  <span className="font-mono text-sm text-[#2BA84A] font-medium mt-1 block">
                    {problem.editorial?.timeComplexity || 'O(N)'}
                  </span>
                </div>

                <div className="bg-[#1E2626] p-3 rounded border border-[#2E3A3A]">
                  <span className="text-xs text-[#8A8A8A] block">Space Complexity</span>
                  <span className="font-mono text-sm text-[#2BA84A] font-medium mt-1 block">
                    {problem.editorial?.spaceComplexity || 'O(1)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Problem Submissions</h2>
              <span className="text-xs text-[#8A8A8A]">
                {problemSubmissions.length} recorded {problemSubmissions.length === 1 ? 'attempt' : 'attempts'}
              </span>
            </div>

            {problemSubmissions.length === 0 ? (
              <div className="text-center py-12 text-[#8A8A8A] bg-[#141A1A] rounded-lg border border-[#242C2C]">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No submissions recorded for this problem yet.</p>
                <p className="text-xs text-[#6A7474] mt-1">Submit your code using the action bar below.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {problemSubmissions.map((sub) => {
                  const isAccepted = sub.verdict === 'Accepted';
                  return (
                    <div
                      key={sub.id}
                      className="bg-[#141A1A] border border-[#283232] rounded-md p-3.5 flex items-center justify-between hover:border-[#384444] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isAccepted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2BA84A] shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <span
                            className={`text-xs font-semibold ${
                              isAccepted ? 'text-[#2BA84A]' : 'text-rose-400'
                            }`}
                          >
                            {sub.verdict}
                          </span>
                          <span className="text-xs text-[#8A8A8A] ml-2">
                            ({sub.testCasesPassed}/{sub.totalTestCases} passed)
                          </span>
                          <div className="text-[11px] text-[#6A7474] mt-0.5">
                            {sub.languageLabel} • {new Date(sub.submittedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedSubmissionCode(sub)}
                        className="px-2.5 py-1 text-xs rounded bg-[#1C2424] hover:bg-[#243030] text-[#D0D0D0] hover:text-white border border-[#303C3C] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Code</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Submitted Code Modal */}
      {selectedSubmissionCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111616] border border-[#333E3E] rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#242E2E]">
              <div>
                <h3 className="text-sm font-bold text-white">Submitted Code</h3>
                <span className="text-xs text-[#8A8A8A]">
                  {selectedSubmissionCode.languageLabel} • {selectedSubmissionCode.verdict}
                </span>
              </div>
              <button
                onClick={() => setSelectedSubmissionCode(null)}
                className="text-[#8A8A8A] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <pre className="bg-[#080D0D] p-3.5 rounded border border-[#242E2E] font-mono text-xs text-[#D8D8D8] overflow-x-auto max-h-80">
              {selectedSubmissionCode.code}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedSubmissionCode(null)}
                className="px-4 py-1.5 rounded bg-[#1E2626] text-white text-xs font-semibold hover:bg-[#283232] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report Modal */}
      {showBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111616] border border-[#333E3E] rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Report Issue or Feedback</h3>
            <p className="text-xs text-[#8A8A8A]">
              Notice an issue with the problem statement or test cases for &quot;{problem.title}&quot;?
            </p>
            {bugSubmitted ? (
              <div className="p-3 bg-[#16231A] text-[#2BA84A] text-xs rounded border border-[#2BA84A]/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you! Your feedback has been noted.</span>
              </div>
            ) : (
              <textarea
                placeholder="Describe the issue..."
                rows={3}
                className="w-full bg-[#080D0D] border border-[#283232] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#2BA84A]"
              />
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setShowBugModal(false);
                  setBugSubmitted(false);
                }}
                className="px-3 py-1.5 rounded bg-[#1A2222] text-[#8A8A8A] text-xs hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              {!bugSubmitted && (
                <button
                  onClick={() => setBugSubmitted(true)}
                  className="px-4 py-1.5 rounded bg-[#2F914B] hover:bg-[#2BA84A] text-white text-xs font-semibold cursor-pointer"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
