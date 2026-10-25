import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ResizablePanelsProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  isEditorFullscreen?: boolean;
}

export const ResizablePanels: React.FC<ResizablePanelsProps> = ({
  leftContent,
  rightContent,
  isEditorFullscreen = false
}) => {
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'problem' | 'editor'>('problem');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - containerRect.left;
      const totalWidth = containerRect.width;

      // Clamp between 20% and 80%
      let newPercent = (currentX / totalWidth) * 100;
      if (newPercent < 22) newPercent = 22;
      if (newPercent > 78) newPercent = 78;

      setLeftWidthPercent(newPercent);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current || !e.touches[0]) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const currentX = e.touches[0].clientX - containerRect.left;
      const totalWidth = containerRect.width;

      let newPercent = (currentX / totalWidth) * 100;
      if (newPercent < 22) newPercent = 22;
      if (newPercent > 78) newPercent = 78;

      setLeftWidthPercent(newPercent);
    };

    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  // If Editor is toggled to fullscreen
  if (isEditorFullscreen) {
    return (
      <div className="flex-1 w-full h-full overflow-hidden bg-[#0B0F14]">
        {rightContent}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
      {/* Mobile Stacked Switcher Tabs (Visible only on < lg screens) */}
      <div className="lg:hidden h-10 bg-[#0E151E] border-b border-[#26313D] flex items-center px-4 shrink-0">
        <div className="flex rounded bg-[#161F2B] p-0.5 border border-[#26313D] w-full">
          <button
            onClick={() => setActiveMobileTab('problem')}
            className={`flex-1 py-1 text-xs font-medium rounded transition-all ${
              activeMobileTab === 'problem'
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'text-[#8B98A7] hover:text-white'
            }`}
          >
            Problem Description
          </button>
          <button
            onClick={() => setActiveMobileTab('editor')}
            className={`flex-1 py-1 text-xs font-medium rounded transition-all ${
              activeMobileTab === 'editor'
                ? 'bg-[#16A34A] text-white shadow-sm'
                : 'text-[#8B98A7] hover:text-white'
            }`}
          >
            Code Editor & Console
          </button>
        </div>
      </div>

      {/* Desktop Split View / Mobile Tab View */}
      <div
        ref={containerRef}
        className="flex-1 w-full h-[calc(100%-2.5rem)] lg:h-full flex flex-row overflow-hidden relative"
      >
        {/* Left Panel: Problem Statement */}
        <div
          style={{ width: `${leftWidthPercent}%` }}
          className={`h-full overflow-hidden flex flex-col border-r border-[#262626] ${
            activeMobileTab === 'problem' ? 'flex w-full lg:flex' : 'hidden lg:flex'
          }`}
        >
          {leftContent}
        </div>

        {/* Draggable Resizer Bar (Desktop only) */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`hidden lg:block panel-resizer ${isDragging ? 'dragging' : ''}`}
          title="Drag to resize panels"
        />

        {/* Right Panel: Code Editor & Tools */}
        <div
          style={{ width: `calc(100% - ${leftWidthPercent}% - 6px)` }}
          className={`h-full overflow-hidden flex flex-col bg-[#111111] ${
            activeMobileTab === 'editor' ? 'flex w-full lg:flex' : 'hidden lg:flex'
          }`}
        >
          {rightContent}
        </div>
      </div>
    </div>
  );
};
