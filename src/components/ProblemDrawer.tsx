import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, FileText } from 'lucide-react';
import type { Problem } from '../types';

interface ProblemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problems: Problem[];
  activeProblemId: string;
  onSelectProblem: (problemId: string) => void;
}

export const ProblemDrawer: React.FC<ProblemDrawerProps> = ({
  isOpen,
  onClose,
  problems,
  activeProblemId,
  onSelectProblem,
}) => {
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-[460px] h-full bg-[#080D0D] border-r border-[#242A2A] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 select-none">
        {/* Top Header of Drawer: Close Icon and < All Problems */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-[#1A2222] shrink-0">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1 text-white hover:text-[#2BA84A] transition-colors cursor-pointer"
            title="Close Drawer"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={() => {
              onClose();
              navigate('/problems');
            }}
            className="flex items-center gap-1 text-[13px] font-semibold text-[#2BA84A] hover:underline cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>All Problems</span>
          </button>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {problems.map((prob) => {
            const isSelected = prob.id === activeProblemId;

            return (
              <button
                key={prob.id}
                onClick={() => {
                  onSelectProblem(prob.id);
                  onClose();
                }}
                className={`w-full h-12 px-3.5 rounded-md flex items-center justify-between text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#203F50] text-white font-medium shadow-sm'
                    : 'bg-transparent text-[#D0D0D0] hover:bg-[#131A1E] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#8A8A8A]'}`} />
                  <span className="text-[13px] tracking-tight truncate">{prob.title}</span>
                </div>

                {/* Status Indicator (Solid white circle as in Screenshot 1) */}
                <div className="w-3 h-3 rounded-full bg-white shrink-0 ml-2 shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
