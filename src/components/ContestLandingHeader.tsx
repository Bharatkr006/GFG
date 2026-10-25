import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Search, Bell, User, Code2 } from 'lucide-react';
import { GfgLogo } from './GfgLogo';
import { ContestTimer } from './ContestTimer';
import { useContestTimer } from '../hooks/useContestTimer';

export const ContestLandingHeader: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();
  const { formattedTime, isUrgent, isFinished, resetTimer } = useContestTimer(120);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-14 bg-[#080D0D] border-b border-[#222222] flex items-center justify-between px-6 select-none shrink-0 z-30">
      {/* Left Navigation Links */}
      <div className="flex items-center gap-6 text-[13px] font-medium text-[#D0D0D0]">
        <Link to="/contest-home" className="hover:text-white transition-colors">
          DSA
        </Link>
        <Link to="/problems" className="hover:text-white transition-colors">
          Problems
        </Link>
        <Link to="/contest-home" className="hover:text-white transition-colors">
          Courses
        </Link>
        <Link to="/contest-home" className="hover:text-white transition-colors">
          Events
        </Link>
        <Link to="/problems" className="hover:text-white transition-colors flex items-center gap-1.5 text-[#2BA84A]">
          <Code2 className="w-3.5 h-3.5" />
          <span>POTD</span>
        </Link>
      </div>

      {/* Centered GeeksforGeeks Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <Link to="/contest-home" aria-label="GeeksforGeeks Home">
          <GfgLogo size={32} />
        </Link>
      </div>

      {/* Right Controls: Real Live Timer, Theme Toggle, Search, Bell, Avatar */}
      <div className="flex items-center gap-3 text-[#A0A0A0]">
        <ContestTimer
          formattedTime={formattedTime}
          isUrgent={isUrgent}
          isFinished={isFinished}
          onReset={() => resetTimer(120)}
        />

        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full bg-[#141A1A] border border-[#282E2E] flex items-center justify-center hover:text-white transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDark ? <Moon className="w-4 h-4 text-[#A0A0A0]" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          className="p-1 hover:text-white transition-colors cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        <div className="relative cursor-pointer">
          <button className="p-1 hover:text-white transition-colors" title="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#E57373]" />
        </div>

        <button
          onClick={() => navigate('/submissions')}
          className="w-7 h-7 rounded-full bg-[#182020] border border-[#333E3E] flex items-center justify-center text-[#D0D0D0] hover:border-[#2BA84A] transition-colors cursor-pointer"
          title="Profile"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
