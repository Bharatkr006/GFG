import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubmitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmFinish: () => void;
  formattedTime: string;
  totalSubmissions: number;
}

export const SubmitDialog: React.FC<SubmitDialogProps> = ({
  isOpen,
  onClose,
  onConfirmFinish,
  formattedTime,
  totalSubmissions
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirmFinish();
    onClose();
    navigate('/submissions');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none animate-fadeIn">
      <div className="bg-[#111820] border border-[#26313D] rounded-lg max-w-md w-full shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#26313D]">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Finish Assessment?</h3>
            <p className="text-xs text-[#8B98A7]">
              Are you sure you want to end your contest session?
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 bg-[#0B0F14] border border-[#26313D] rounded-md p-3 text-xs">
          <div className="space-y-1">
            <span className="text-[#8B98A7] flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-[#3FB950]" /> Time Left
            </span>
            <span className="font-mono text-sm font-bold text-white">{formattedTime}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[#8B98A7] flex items-center gap-1 text-[11px]">
              <Trophy className="w-3 h-3 text-amber-400" /> Total Submissions
            </span>
            <span className="font-mono text-sm font-bold text-white">{totalSubmissions}</span>
          </div>
        </div>

        <p className="text-xs text-[#8B98A7] leading-relaxed">
          Once you confirm, the contest timer will be stopped and you will be directed to the
          overall assessment scoreboard and submission report.
        </p>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#161F2B] hover:bg-[#1E2938] text-[#8B98A7] hover:text-white text-xs font-medium border border-[#26313D] transition-colors"
          >
            Continue Working
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Finish Contest</span>
          </button>
        </div>
      </div>
    </div>
  );
};
