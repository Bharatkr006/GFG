import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface ContestTimerProps {
  formattedTime: string;
  isUrgent: boolean;
  isFinished: boolean;
  onReset?: () => void;
}

export const ContestTimer: React.FC<ContestTimerProps> = ({
  formattedTime,
  isUrgent,
  isFinished,
  onReset
}) => {
  if (isFinished) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-950/50 border border-red-800/80 text-red-400 text-xs font-semibold tracking-wide select-none">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>CONTEST ENDED</span>
        {onReset && (
          <button
            onClick={onReset}
            className="ml-1 text-[11px] underline text-red-300 hover:text-white cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-md border font-mono text-xs transition-colors select-none ${
        isUrgent
          ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse'
          : 'bg-[#141A1A] border-[#2C3434] text-[#F1F1F1]'
      }`}
      title={isUrgent ? 'Warning: Less than 10 minutes remaining!' : 'Contest Time Remaining'}
    >
      <Clock className={`w-3.5 h-3.5 shrink-0 ${isUrgent ? 'text-amber-400' : 'text-[#2BA84A]'}`} />
      <span className="font-semibold text-xs tracking-wider">{formattedTime}</span>
      {isUrgent && (
        <span className="hidden sm:inline-block text-[9px] uppercase font-bold text-amber-400 bg-amber-500/20 px-1 py-0.2 rounded">
          Urgent
        </span>
      )}
    </div>
  );
};
