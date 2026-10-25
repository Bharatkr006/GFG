import React, { useState, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
import type { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/problems';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language: SupportedLanguage;
  fontSize: number;
  theme: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  fontSize,
  theme,
  onChange
}) => {
  const [hasMonacoError, setHasMonacoError] = useState(false);
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.id === language);
  const monacoLanguage = langConfig ? langConfig.monacoLang : 'cpp';

  const handleEditorDidMount: OnMount = (_editor, monaco) => {
    // 1. Register tailored Monarch tokenizer for C++ to match GeeksforGeeks contest platform 100%
    monaco.languages.setMonarchTokensProvider('cpp', {
      defaultToken: '',
      tokenPostfix: '.cpp',
      keywords: [
        'class', 'struct', 'enum', 'union', 'namespace', 'template', 'typename',
        'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default',
        'break', 'continue', 'goto', 'try', 'catch', 'throw', 'new', 'delete',
        'sizeof', 'typedef', 'using', 'static', 'const', 'constexpr', 'inline',
        'extern', 'friend', 'operator', 'override', 'final', 'noexcept'
      ],
      modifiers: [
        'public', 'private', 'protected', 'virtual', 'explicit', 'mutable'
      ],
      primitiveTypes: [
        'int', 'long', 'short', 'char', 'bool', 'float', 'double', 'void',
        'size_t', 'int32_t', 'int64_t', 'uint32_t', 'uint64_t', 'auto', 'unsigned', 'signed'
      ],
      containers: [
        'vector', 'string', 'map', 'unordered_map', 'set', 'unordered_set',
        'pair', 'tuple', 'queue', 'deque', 'priority_queue', 'stack', 'list', 'array'
      ],
      tokenizer: {
        root: [
          // Comments
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],

          // Modifiers (public:, private:, protected:) -> Coral/Salmon Red
          [/\b(public|private|protected)\b/, 'keyword.modifier'],

          // Class keyword -> Yellow
          [/\bclass\b/, 'keyword.class'],

          // Primitive types -> Warm Orange/Peach
          [/\b(int|long|short|char|bool|float|double|void|size_t|auto|unsigned|signed)\b/, 'type.primitive'],

          // Container types -> Purple/Violet
          [/\b(vector|string|map|unordered_map|set|unordered_set|pair|tuple|queue|deque|priority_queue|stack|list|array)\b/, 'type.container'],

          // PascalCase Class identifiers -> Cyan/Teal
          [/\b[A-Z][a-zA-Z0-9_]*\b/, 'type.class'],

          // Other keywords -> Yellow
          [/\b(return|if|else|for|while|do|switch|case|break|continue|default|using|namespace|new|delete)\b/, 'keyword'],

          // Identifiers & Function Names -> Crisp White
          [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],

          // Numbers -> Amber
          [/\d*\.\d+([eE][-+]?\d+)?/, 'number'],
          [/\d+/, 'number'],

          // Strings -> Green
          [/"([^"\\]|\\.)*"/, 'string'],
          [/'([^'\\]|\\.)*'/, 'string'],

          // Brackets for Bracket Pair Colorizer
          [/[{}()\[\]]/, '@brackets'],
          [/[<>]/, '@brackets'],

          // Operators & Delimiters
          [/[:,;&]/, 'delimiter'],
          [/[-+/*%=!~?|]/, 'operator'],
          [/[ \t\r\n]+/, 'white']
        ],
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ]
      }
    });

    // 2. Define custom GeeksforGeeks dark theme with exact token colors & bracket pair palette
    monaco.editor.defineTheme('gfg-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5C6370', fontStyle: 'italic' },
        { token: 'keyword.class', foreground: 'E5C07B', fontStyle: 'normal' },
        { token: 'keyword.modifier', foreground: 'FF6B68', fontStyle: 'normal' },
        { token: 'type.primitive', foreground: 'FF9E64', fontStyle: 'normal' },
        { token: 'type.container', foreground: 'C678DD', fontStyle: 'normal' },
        { token: 'type.class', foreground: '4EC9B0', fontStyle: 'normal' },
        { token: 'keyword', foreground: 'E5C07B', fontStyle: 'normal' },
        { token: 'identifier', foreground: 'FFFFFF', fontStyle: 'normal' },
        { token: 'delimiter', foreground: 'ABB2BF' },
        { token: 'operator', foreground: 'ABB2BF' },
        { token: 'string', foreground: '98C379' },
        { token: 'number', foreground: 'D19A66' }
      ],
      colors: {
        'editor.background': '#0D0D0D',
        'editor.foreground': '#FFFFFF',
        'editor.lineHighlightBackground': '#141414',
        'editor.lineHighlightBorder': '#1E1E1E',
        'editorLineNumber.foreground': '#4B5263',
        'editorLineNumber.activeForeground': '#FFFFFF',
        'editorGutter.background': '#0D0D0D',
        'editorGutter.foldingControlForeground': '#5C6370',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#264F7844',
        'editorCursor.foreground': '#FFFFFF',
        'editorIndentGuide.background': '#1C1F26',
        'editorIndentGuide.activeBackground': '#2D333B',
        // Bracket pair colors matching screenshot
        'editorBracketHighlight.foreground1': '#FFD700', // Level 1: Yellow { }
        'editorBracketHighlight.foreground2': '#DA70D6', // Level 2: Pink/Magenta ( ) { }
        'editorBracketHighlight.foreground3': '#179FFF', // Level 3: Cyan < >
      }
    });

    if (theme === 'vs-dark' || theme === 'gfg-dark') {
      monaco.editor.setTheme('gfg-dark');
    }
  };

  useEffect(() => {
    try {
      loader.init().catch(() => {});
    } catch {
      setHasMonacoError(true);
    }
  }, []);

  if (hasMonacoError) {
    return (
      <div className="flex-1 h-full w-full bg-[#0D0D0D] p-3 flex flex-col">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 w-full h-full bg-[#0D0D0D] text-[#FFFFFF] font-mono text-sm p-4 rounded border border-[#2A2A2A] focus:outline-none resize-none"
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full w-full relative bg-[#0D0D0D] overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={monacoLanguage}
        value={code}
        theme={theme === 'vs-dark' ? 'gfg-dark' : 'light'}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex flex-col items-center justify-center h-full text-[#888888] gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#2BA84A]" />
            <span className="text-xs font-mono">Loading Editor...</span>
          </div>
        }
        options={{
          fontSize: fontSize || 14,
          lineHeight: 22,
          fontFamily: "'Consolas', 'Courier New', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          wordWrap: 'on',
          lineNumbers: 'on',
          lineNumbersMinChars: 2,
          lineDecorationsWidth: 4,
          glyphMargin: false,
          folding: true,
          foldingStrategy: 'auto',
          showFoldingControls: 'always',
          bracketPairColorization: {
            enabled: true
          },
          guides: {
            indentation: true,
            bracketPairs: false
          },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: false,
          renderLineHighlight: 'all',
          renderLineHighlightOnlyWhenFocus: false,
          overviewRulerBorder: false,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
            useShadows: false
          },
          padding: { top: 10, bottom: 10 }
        }}
      />
    </div>
  );
};
