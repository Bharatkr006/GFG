import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, RotateCw, Eye } from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { storage } from '../utils/storage';
import type { SubmissionRecord } from '../types';
import { Header } from '../components/Header';

export const SubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>(() => storage.getSubmissions());

  // Filter state
  const [submissionTypeFilter, setSubmissionTypeFilter] = useState<'my' | 'all'>('my');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(PROBLEMS[0].id);
  const [selectedCodeSubmission, setSelectedCodeSubmission] = useState<SubmissionRecord | null>(null);

  // Reload submissions from storage
  const handleRefresh = () => {
    setSubmissions(storage.getSubmissions());
  };

  // Check if problem is solved
  const isProblemSolved = (probId: string) => {
    return submissions.some((s) => s.problemId === probId && s.verdict === 'Accepted');
  };

  // Filter submissions based on current controls
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesProblem = selectedProblemId === 'ALL' || sub.problemId === selectedProblemId;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'Accepted' && sub.verdict === 'Accepted') ||
      (statusFilter === 'Wrong Answer' && sub.verdict === 'Wrong Answer') ||
      sub.verdict === statusFilter;
    return matchesProblem && matchesStatus;
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-[#080D0D] overflow-hidden select-none">
      {/* Contest Header */}
      <Header />

      {/* Two-Column Split Layout */}
      <div className="flex-1 w-full h-[calc(100vh-52px)] flex flex-col md:flex-row overflow-hidden">
        {/* Left Column: All Problems (~40% desktop width) */}
        <div className="w-full md:w-[40%] md:min-w-[450px] md:max-w-[620px] h-full bg-[#090E0E] border-r border-[#222828] p-5 sm:p-6 overflow-y-auto flex flex-col justify-between shrink-0">
          <div>
            <h1 className="text-xl sm:text-[22px] font-bold text-white mb-4 tracking-tight">
              All Problems
            </h1>

            {/* 4 Problem Cards Stack */}
            <div className="space-y-3.5">
              {PROBLEMS.map((prob) => {
                const solved = isProblemSolved(prob.id);

                return (
                  <div
                    key={prob.id}
                    className="bg-[#171B1B] border border-[#303636] rounded-md p-4 transition-colors hover:border-[#404848]"
                  >
                    {/* Top Row: Title & Max Marks */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {solved && <CheckCircle2 className="w-4 h-4 text-[#2BA84A] shrink-0" />}
                        <h2 className="text-[15px] font-semibold text-white tracking-tight">
                          {prob.title}
                        </h2>
                      </div>
                      <span className="text-xs text-[#8A8A8A] shrink-0 font-medium">
                        Max Marks:{prob.maxMarks}
                      </span>
                    </div>

                    {/* Bottom Row: Submission, Accuracy, and Solve Button */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-6 sm:gap-8 text-[13px] text-[#A0A0A0]">
                        <span>
                          Submission: <strong className="font-normal text-white">{prob.submissionsCount.replace('+', '')}</strong>
                        </span>
                        <span>
                          Accuracy: <strong className="font-normal text-white">{prob.accuracy}</strong>
                        </span>
                      </div>

                      <button
                        onClick={() => navigate(`/problems/${prob.id}`)}
                        className="px-5 py-1.5 rounded-md bg-[#2F914B] hover:bg-[#288042] text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Solve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Legend matching Screenshot 3 */}
          <div className="mt-6 pt-4 border-t border-[#1C2222] flex items-center gap-6 text-xs text-[#A0A0A0]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2BA84A]" />
              <span>Solution Accepted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-[#E53935]" />
              <span>Wrong Answer</span>
            </div>
          </div>
        </div>

        {/* Right Column: Submissions (~60% desktop width) */}
        <div className="flex-1 h-full bg-[#141818] p-6 sm:p-8 overflow-y-auto flex flex-col">
          <h2 className="text-xl sm:text-[22px] font-bold text-white mb-4 tracking-tight">
            Submissions
          </h2>

          {/* Compact Dropdown Filters Row */}
          <div className="flex flex-wrap items-center gap-2.5 pb-4">
            {/* Filter 1: My Submissions */}
            <select
              value={submissionTypeFilter}
              onChange={(e) => setSubmissionTypeFilter(e.target.value as 'my' | 'all')}
              className="bg-[#1B2020] border border-[#353B3B] text-white text-xs font-medium rounded px-3 py-1.5 focus:outline-none focus:border-[#2BA84A] cursor-pointer"
            >
              <option value="my">My Submissions</option>
              <option value="all">All Submissions</option>
            </select>

            {/* Filter 2: Select Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1B2020] border border-[#353B3B] text-white text-xs font-medium rounded px-3 py-1.5 focus:outline-none focus:border-[#2BA84A] cursor-pointer"
            >
              <option value="ALL">Select Status</option>
              <option value="Accepted">Solution Accepted</option>
              <option value="Wrong Answer">Wrong Answer</option>
              <option value="Compilation Error">Compilation Error</option>
              <option value="Runtime Error">Runtime Error</option>
            </select>

            {/* Filter 3: Problem Selector (Initially showing Problem 1) */}
            <select
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
              className="bg-[#1B2020] border border-[#353B3B] text-white text-xs font-medium rounded px-3 py-1.5 focus:outline-none focus:border-[#2BA84A] cursor-pointer max-w-[200px] truncate"
            >
              <option value="ALL">All Problems</option>
              {PROBLEMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded bg-[#1B2020] border border-[#353B3B] text-[#A0A0A0] hover:text-white hover:border-[#4B5555] transition-colors cursor-pointer"
              title="Refresh submissions"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Submissions Content Area: Clean uninterrupted charcoal surface when empty */}
          {filteredSubmissions.length === 0 ? (
            <div className="flex-1 w-full min-h-[300px]" />
          ) : (
            <div className="mt-2 space-y-2 max-w-4xl">
              <div className="bg-[#1B2020] border border-[#303838] rounded-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#151A1A] border-b border-[#283232] text-[#8A8A8A]">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Problem</th>
                      <th className="py-2.5 px-4 font-medium">Status</th>
                      <th className="py-2.5 px-4 font-medium">Language</th>
                      <th className="py-2.5 px-4 font-medium">Runtime</th>
                      <th className="py-2.5 px-4 font-medium">Time</th>
                      <th className="py-2.5 px-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242C2C] text-[#D0D0D0]">
                    {filteredSubmissions.map((sub) => {
                      const isAccepted = sub.verdict === 'Accepted';
                      return (
                        <tr key={sub.id} className="hover:bg-[#202727] transition-colors">
                          <td className="py-2.5 px-4 font-medium text-white">{sub.problemTitle}</td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`flex items-center gap-1.5 ${
                                isAccepted ? 'text-[#2BA84A]' : 'text-[#E53935]'
                              }`}
                            >
                              {isAccepted ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              <span>{sub.verdict}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-4">{sub.languageLabel}</td>
                          <td className="py-2.5 px-4 font-mono">{sub.runtime || '-'}</td>
                          <td className="py-2.5 px-4 text-[#8A8A8A]">
                            {new Date(sub.submittedAt).toLocaleTimeString()}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedCodeSubmission(sub)}
                              className="text-xs text-[#2BA84A] hover:underline flex items-center gap-1 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Modal */}
      {selectedCodeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-[#111616] border border-[#333E3E] rounded-lg max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#242E2E]">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedCodeSubmission.problemTitle}</h3>
                <span className="text-xs text-[#8A8A8A]">
                  {selectedCodeSubmission.languageLabel} • {selectedCodeSubmission.verdict}
                </span>
              </div>
              <button
                onClick={() => setSelectedCodeSubmission(null)}
                className="text-[#8A8A8A] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <pre className="bg-[#080D0D] p-3.5 rounded border border-[#242E2E] font-mono text-xs text-[#D8D8D8] overflow-x-auto max-h-80">
              {selectedCodeSubmission.code}
            </pre>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCodeSubmission(null)}
                className="px-4 py-1.5 rounded bg-[#1E2626] text-white text-xs font-semibold hover:bg-[#283232] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
