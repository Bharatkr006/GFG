import type { SubmissionRecord, SupportedLanguage } from '../types';

const PREFIX = 'codearena_';

export const storage = {
  // Code Drafts
  getCodeDraft(problemId: string, language: SupportedLanguage, defaultCode: string): string {
    try {
      const saved = localStorage.getItem(`${PREFIX}draft_${problemId}_${language}`);
      if (saved && (saved.includes('#include <bits/stdc++.h>') || saved.includes('vector<int>& arr') || saved.includes('vector<int>arr'))) {
        localStorage.setItem(`${PREFIX}draft_${problemId}_${language}`, defaultCode);
        return defaultCode;
      }
      return saved !== null ? saved : defaultCode;
    } catch {
      return defaultCode;
    }
  },

  saveCodeDraft(problemId: string, language: SupportedLanguage, code: string): void {
    try {
      localStorage.setItem(`${PREFIX}draft_${problemId}_${language}`, code);
    } catch (e) {
      console.error('Failed to save code draft:', e);
    }
  },

  clearCodeDraft(problemId: string, language: SupportedLanguage): void {
    try {
      localStorage.removeItem(`${PREFIX}draft_${problemId}_${language}`);
    } catch (e) {
      console.error('Failed to clear code draft:', e);
    }
  },

  // Custom Input
  getCustomInput(problemId: string, defaultInput: string): string {
    try {
      const saved = localStorage.getItem(`${PREFIX}custom_input_${problemId}`);
      return saved !== null ? saved : defaultInput;
    } catch {
      return defaultInput;
    }
  },

  saveCustomInput(problemId: string, input: string): void {
    try {
      localStorage.setItem(`${PREFIX}custom_input_${problemId}`, input);
    } catch (e) {
      console.error('Failed to save custom input:', e);
    }
  },

  // Submissions
  getSubmissions(): SubmissionRecord[] {
    try {
      const raw = localStorage.getItem(`${PREFIX}submissions`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveSubmission(record: SubmissionRecord): void {
    try {
      const current = storage.getSubmissions();
      const updated = [record, ...current];
      localStorage.setItem(`${PREFIX}submissions`, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save submission:', e);
    }
  },

  clearSubmissions(): void {
    try {
      localStorage.removeItem(`${PREFIX}submissions`);
    } catch (e) {
      console.error('Failed to clear submissions:', e);
    }
  },

  // Bookmarks
  getBookmarks(): string[] {
    try {
      const raw = localStorage.getItem(`${PREFIX}bookmarks`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(problemId: string): boolean {
    try {
      const current = storage.getBookmarks();
      const exists = current.includes(problemId);
      const updated = exists
        ? current.filter(id => id !== problemId)
        : [...current, problemId];
      localStorage.setItem(`${PREFIX}bookmarks`, JSON.stringify(updated));
      return !exists;
    } catch {
      return false;
    }
  },

  isBookmarked(problemId: string): boolean {
    return storage.getBookmarks().includes(problemId);
  },

  // Contest Timer and Status
  getContestDeadline(durationMinutes = 120): number {
    try {
      const raw = localStorage.getItem(`${PREFIX}contest_deadline`);
      if (raw) {
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed) && parsed > Date.now()) return parsed;
      }
      // Initialize with fresh deadline
      const deadline = Date.now() + durationMinutes * 60 * 1000;
      localStorage.setItem(`${PREFIX}contest_deadline`, deadline.toString());
      localStorage.removeItem(`${PREFIX}contest_finished`);
      localStorage.removeItem(`${PREFIX}contest_finished_at`);
      return deadline;
    } catch {
      return Date.now() + durationMinutes * 60 * 1000;
    }
  },

  resetContestDeadline(durationMinutes = 120): number {
    try {
      const deadline = Date.now() + durationMinutes * 60 * 1000;
      localStorage.setItem(`${PREFIX}contest_deadline`, deadline.toString());
      localStorage.removeItem(`${PREFIX}contest_finished`);
      localStorage.removeItem(`${PREFIX}contest_finished_at`);
      return deadline;
    } catch {
      return Date.now() + durationMinutes * 60 * 1000;
    }
  },

  isContestFinished(): boolean {
    try {
      return localStorage.getItem(`${PREFIX}contest_finished`) === 'true';
    } catch {
      return false;
    }
  },

  setContestFinished(finished: boolean): void {
    try {
      if (finished) {
        localStorage.setItem(`${PREFIX}contest_finished`, 'true');
        localStorage.setItem(`${PREFIX}contest_finished_at`, new Date().toISOString());
      } else {
        localStorage.removeItem(`${PREFIX}contest_finished`);
        localStorage.removeItem(`${PREFIX}contest_finished_at`);
      }
    } catch (e) {
      console.error('Failed to update contest status:', e);
    }
  },

  // Preferences (font size, theme, etc.)
  getFontSize(): number {
    try {
      const saved = localStorage.getItem(`${PREFIX}editor_font_size`);
      return saved ? parseInt(saved, 10) : 14;
    } catch {
      return 14;
    }
  },

  saveFontSize(size: number): void {
    try {
      localStorage.setItem(`${PREFIX}editor_font_size`, size.toString());
    } catch {}
  },

  getEditorTheme(): string {
    try {
      return localStorage.getItem(`${PREFIX}editor_theme`) || 'vs-dark';
    } catch {
      return 'vs-dark';
    }
  },

  saveEditorTheme(theme: string): void {
    try {
      localStorage.setItem(`${PREFIX}editor_theme`, theme);
    } catch {}
  }
};
