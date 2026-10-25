import React, { useState } from 'react';
import {
  RotateCcw,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  Settings,
  AlignJustify
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/problems';

interface EditorToolbarProps {
  language: SupportedLanguage;
  onLanguageChange: (newLang: SupportedLanguage) => void;
  fontSize: number;
  onFontSizeChange: (newSize: number) => void;
  onResetCode: () => void;
  onCopyCode: () => void;
  onDownloadCode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  editorTheme: string;
  onToggleTheme: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language,
  onLanguageChange,
  fontSize,
  onFontSizeChange,
  onResetCode,
  onCopyCode,
  onDownloadCode,
  isFullscreen,
  onToggleFullscreen,
  editorTheme,
  onToggleTheme
}) => {
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleCopy = () => {
    onCopyCode();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetConfirm = () => {
    onResetCode();
    setShowResetConfirm(false);
  };

  return (
    <div className="h-10 bg-[#242424] border-b border-[#333333] px-3.5 flex items-center justify-between text-xs text-[#888888] shrink-0 select-none">
      {/* Left item: Language Selector Dropdown (e.g., C++ (17) ▾) */}
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          className="bg-[#242424] border border-[#3E3E3E] text-[#F1F1F1] text-xs font-medium rounded px-2.5 py-1 focus:outline-none focus:border-[#2BA84A] cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-[#1E1E1E] text-white">
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right Action Icons: Layout, Copy, Download, Settings, Reset, Fullscreen */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Editor Layout icon */}
        <button
          onClick={onToggleFullscreen}
          className="p-1 hover:text-white transition-colors cursor-pointer"
          title="Toggle Editor Layout"
        >
          <AlignJustify className="w-[15px] h-[15px]" />
        </button>

        {/* Copy Code */}
        <button
          onClick={handleCopy}
          className="p-1 hover:text-white transition-colors cursor-pointer"
          title={copied ? 'Copied to clipboard!' : 'Copy Code'}
        >
          {copied ? <Check className="w-[15px] h-[15px] text-[#2BA84A]" /> : <Copy className="w-[15px] h-[15px]" />}
        </button>

        {/* Download Code */}
        <button
          onClick={onDownloadCode}
          className="p-1 hover:text-white transition-colors cursor-pointer"
          title="Download Code"
        >
          <Download className="w-[15px] h-[15px]" />
        </button>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title="Editor Settings"
          >
            <Settings className="w-[15px] h-[15px]" />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-8 w-48 bg-[#1A1A1A] border border-[#3A3A3A] rounded shadow-2xl p-3 z-40 text-xs text-[#D0D0D0] space-y-3">
              <div className="flex items-center justify-between">
                <span>Font Size</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onFontSizeChange(Math.max(11, fontSize - 1))}
                    className="w-5 h-5 rounded bg-[#252525] flex items-center justify-center hover:text-white"
                  >
                    -
                  </button>
                  <span className="font-mono">{fontSize}px</span>
                  <button
                    onClick={() => onFontSizeChange(Math.min(22, fontSize + 1))}
                    className="w-5 h-5 rounded bg-[#252525] flex items-center justify-center hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#2A2A2A]">
                <span>Theme</span>
                <button
                  onClick={onToggleTheme}
                  className="px-2 py-0.5 rounded bg-[#252525] text-white hover:bg-[#333333]"
                >
                  {editorTheme === 'vs-dark' ? 'Dark' : 'Light'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reset Code */}
        <div className="relative">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-1 hover:text-white transition-colors cursor-pointer"
            title="Reset to Starter Template"
          >
            <RotateCcw className="w-[15px] h-[15px]" />
          </button>

          {showResetConfirm && (
            <div className="absolute right-0 top-8 w-52 bg-[#1A1A1A] border border-[#3A3A3A] rounded shadow-2xl p-3 z-40 text-xs">
              <p className="text-[#F1F1F1] mb-2 font-medium">Reset editor code?</p>
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 rounded bg-[#252525] text-[#A0A0A0] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetConfirm}
                  className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Editor Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1 hover:text-white transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-[15px] h-[15px]" /> : <Maximize2 className="w-[15px] h-[15px]" />}
        </button>
      </div>
    </div>
  );
};
