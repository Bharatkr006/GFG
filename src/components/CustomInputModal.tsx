import React from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface CustomInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  customInput: string;
  onChange: (val: string) => void;
  useCustomInput: boolean;
  onToggleUseCustomInput: (use: boolean) => void;
  defaultInput: string;
}

export const CustomInputModal: React.FC<CustomInputModalProps> = ({
  isOpen,
  onClose,
  customInput,
  onChange,
  useCustomInput,
  onToggleUseCustomInput,
  defaultInput
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 select-none">
      <div className="bg-[#111820] border border-[#26313D] rounded-lg max-w-lg w-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#26313D]">
          <h3 className="font-semibold text-sm text-white">Custom Input (Stdin)</h3>
          <button
            onClick={onClose}
            className="text-[#8B98A7] hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#8B98A7]">
              Provide stdin arguments for "Compile & Run":
            </label>
            <button
              onClick={() => onChange(defaultInput)}
              className="flex items-center gap-1 text-[11px] text-[#3FB950] hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Sample 1</span>
            </button>
          </div>

          <textarea
            value={customInput}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder="e.g.&#10;4&#10;2 17 7 3"
            className="w-full bg-[#0B0F14] border border-[#26313D] rounded-md p-3 text-xs font-mono text-[#E6EDF3] focus:outline-none focus:border-[#16A34A] resize-none"
            spellCheck={false}
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="useCustomInputCheckbox"
              checked={useCustomInput}
              onChange={(e) => onToggleUseCustomInput(e.target.checked)}
              className="rounded bg-[#0B0F14] border-[#26313D] text-[#16A34A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label
              htmlFor="useCustomInputCheckbox"
              className="text-xs text-[#E6EDF3] cursor-pointer"
            >
              Use this custom input when clicking <span className="text-[#3FB950] font-semibold">Compile & Run</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#26313D] flex justify-end gap-2 bg-[#0E151E]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-semibold flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
