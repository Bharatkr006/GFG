import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { GfgLogo } from './GfgLogo';
import { ContestTimer } from './ContestTimer';
import { useContestTimer } from '../hooks/useContestTimer';

interface HeaderProps {
  showTimer?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showTimer = true }) => {
  const [isDark, setIsDark] = useState(true);
  const { formattedTime, isUrgent, isFinished, resetTimer } = useContestTimer(120);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-[52px] bg-[#080D0D] border-b border-[#222222] flex items-center justify-between px-6 select-none shrink-0 z-30">
      {/* Left Navigation Links: Contest Home, Coding Problems */}
      <div className="flex items-center gap-7 text-[13px] font-medium">
        <NavLink
          to="/contest-home"
          className={({ isActive }) =>
            `transition-colors ${
              isActive ? 'text-[#2BA84A] font-semibold' : 'text-[#D0D0D0] hover:text-white'
            }`
          }
        >
          Contest Home
        </NavLink>
        <NavLink
          to="/problems"
          className={({ isActive }) =>
            `transition-colors ${
              isActive ? 'text-[#2BA84A] font-semibold underline underline-offset-4 decoration-2' : 'text-[#2BA84A] font-semibold'
            }`
          }
        >
          Coding Problems
        </NavLink>
      </div>

      {/* Centered GeeksforGeeks Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <Link to="/contest-home" aria-label="GeeksforGeeks Home">
          <GfgLogo size={28} />
        </Link>
      </div>

      {/* Right Controls: Real Live Contest Timer & Theme Toggle */}
      <div className="flex items-center gap-3">
        {showTimer && (
          <ContestTimer
            formattedTime={formattedTime}
            isUrgent={isUrgent}
            isFinished={isFinished}
            onReset={() => resetTimer(120)}
          />
        )}

        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full bg-[#141A1A] border border-[#282E2E] flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>
    </header>
  );
};
