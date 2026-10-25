import React from 'react';

interface GfgLogoProps {
  className?: string;
  size?: number;
}

export const GfgLogo: React.FC<GfgLogoProps> = ({ className = 'h-7 w-auto', size = 30 }) => {
  return (
    <svg
      viewBox="0 0 100 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ height: size, width: 'auto' }}
      aria-label="GeeksforGeeks Logo"
    >
      {/* GeeksforGeeks stylized green curly brackets emblem */}
      <path
        d="M45.5 31c-5.8 0-9.5-3.8-11-8-1.2-3.8-1.2-8.3-4-11-2.8-2.8-6.8-3.5-12-3.5H6v9.5h12.5c3 0 4.8.5 6 1.5 1 1 1.2 2.5 1.8 4.5 1.5 5.8 5.8 11 13.2 12-7.4 1-11.7 6.2-13.2 12-.6 2-.8 3.5-1.8 4.5-1.2 1-3 1.5-6 1.5H6V61h12.5c5.2 0 9.2-.7 12-3.5 2.8-2.7 2.8-7.2 4-11 1.5-4.2 5.2-8 11-8h1.2v-7.5H45.5zm9 0c5.8 0 9.5-3.8 11-8 1.2-3.8 1.2-8.3 4-11 2.8-2.8 6.8-3.5 12-3.5H94v9.5H81.5c-3 0-4.8.5-6 1.5-1 1-1.2 2.5-1.8 4.5-1.5 5.8-5.8 11-13.2 12 7.4 1 11.7 6.2 13.2 12 .6 2 .8 3.5 1.8 4.5 1.2 1 3 1.5 6 1.5H94V61H81.5c-5.2 0-9.2-.7-12-3.5-2.8-2.7-2.8-7.2-4-11-1.5-4.2-5.2-8-11-8h-1.2v-7.5h1.2z"
        fill="#2BA84A"
      />
    </svg>
  );
};
