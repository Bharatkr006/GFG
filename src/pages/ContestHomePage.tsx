import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckSquare, Calendar, Clock } from 'lucide-react';
import { ContestLandingHeader } from '../components/ContestLandingHeader';
import { useContestTimer } from '../hooks/useContestTimer';

export const ContestHomePage: React.FC = () => {
  const { formattedTime } = useContestTimer(120);
  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#080D0D] text-[#F1F1F1] overflow-x-hidden select-none font-sans">
      {/* Top Header */}
      <ContestLandingHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14 py-8 overflow-y-auto">
        {/* Top 2-Column Section */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Status Card (~300px width) */}
          <div className="w-full lg:w-[310px] bg-[#111616] border border-[#242A2A] rounded-lg p-5 shrink-0 shadow-sm">
            <p className="text-[13px] text-[#A0A0A0] leading-relaxed">
              This contest is now over! It took place from 11 Oct 2026 11:00 AM (IST) to 11 Oct 2026 01:00 PM (IST)
            </p>

            <Link
              to="/problems"
              className="mt-5 w-full py-2 px-4 rounded-md bg-[#2F914B] hover:bg-[#288042] text-white text-xs font-semibold text-center block transition-colors shadow-sm cursor-pointer"
            >
              Go to Contest
            </Link>

            <div className="mt-4 pt-3 border-t border-[#1F2727] flex items-center justify-between text-xs">
              <span className="text-[#8A8A8A] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2BA84A]" /> Time Remaining:
              </span>
              <span className="font-mono font-bold text-white text-xs tracking-wider">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Right Main Info Panel */}
          <div className="flex-1 w-full bg-[#111616] border border-[#242A2A] rounded-lg p-6 sm:p-7 shadow-sm">
            {/* Contest Title & Archived Pill */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Weekly Assessment 10 - SKIT x GfG
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FDE8E4] text-[#E07A5F] text-[11px] font-semibold tracking-wide">
                Archived
              </span>
            </div>

            {/* Questions, Marks, Hours Summary Bar */}
            <div className="mt-4 bg-[#181D1D] border border-[#262D2D] rounded-md px-4 py-2.5 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#D0D0D0]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A0A0A0]" />
                <span className="font-medium">4 Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#A0A0A0]" />
                <span className="font-medium">100 Marks</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#A0A0A0]" />
                <span className="font-medium">2 Hours</span>
              </div>
            </div>

            {/* Contest Description */}
            <p className="mt-4 text-[13px] text-[#A0A0A0] leading-relaxed">
              Get ready for an exciting coding challenge designed to test your problem-solving skills across
              multiple difficulty levels. The contest includes 4 problems:
            </p>

            {/* Test Structure */}
            <div className="mt-4">
              <h2 className="text-xs font-bold text-white mb-2">Test Structure:</h2>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#A0A0A0] ml-1">
                <li>Easy - 1 Question</li>
                <li>Medium - 3 Questions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions for the Contest Section */}
        <div className="mt-10 pt-4 max-w-4xl">
          <h2 className="text-xl font-bold text-white tracking-tight mb-5">
            Instructions for the Contest
          </h2>

          <div className="space-y-6 text-[13px]">
            {/* Section 1 */}
            <div>
              <h3 className="font-bold text-white mb-2">1. Before the Test</h3>
              <ul className="list-disc list-inside space-y-1.5 text-[#A0A0A0] ml-2">
                <li>Ensure you have a stable internet connection and a fully charged laptop/desktop.</li>
                <li>Use an updated browser and disable all browser extensions.</li>
                <li>Close unnecessary apps and tabs.</li>
                <li>Take the test from a quiet, distraction-free place.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="font-bold text-white mb-2">2. Login &amp; Setup</h3>
              <ul className="list-disc list-inside space-y-1.5 text-[#A0A0A0] ml-2">
                <li>Log in 10 minutes before the scheduled time.</li>
                <li>Complete all required verification steps before the test starts.</li>
                <li>Accept the cookie consent if prompted.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="font-bold text-white mb-2">3. During the Test</h3>
              <ul className="list-disc list-inside space-y-1.5 text-[#A0A0A0] ml-2">
                <li>Stay in full-screen mode and do not switch tabs or open other applications.</li>
                <li>Do not minimize or resize the test window.</li>
                <li>Do not use mobile phones, calculators, AI tools, or other external devices unless permitted.</li>
                <li>Avoid any unauthorized copy-paste or attempts to bypass system restrictions.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
