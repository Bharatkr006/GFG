import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';

export interface ContestTimerState {
  remainingSeconds: number;
  formattedTime: string;
  isUrgent: boolean; // less than 10 minutes
  isFinished: boolean;
  finishContest: () => void;
  resetTimer: (minutes?: number) => void;
}

export function useContestTimer(durationMinutes = 120): ContestTimerState {
  const [deadline, setDeadline] = useState<number>(() => {
    return storage.getContestDeadline(durationMinutes);
  });

  const [isFinished, setIsFinished] = useState<boolean>(() => {
    return storage.isContestFinished();
  });

  const calculateRemaining = useCallback((targetDeadline: number): number => {
    if (storage.isContestFinished()) return 0;
    const now = Date.now();
    const diff = Math.max(0, Math.floor((targetDeadline - now) / 1000));
    return diff;
  }, []);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    return calculateRemaining(deadline);
  });

  useEffect(() => {
    if (isFinished) {
      setRemainingSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateRemaining(deadline);
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        setIsFinished(true);
        storage.setContestFinished(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, isFinished, calculateRemaining]);

  const finishContest = useCallback(() => {
    setIsFinished(true);
    storage.setContestFinished(true);
    setRemainingSeconds(0);
  }, []);

  const resetTimer = useCallback((newMinutes = 120) => {
    const newDeadline = storage.resetContestDeadline(newMinutes);
    setDeadline(newDeadline);
    setIsFinished(false);
    setRemainingSeconds(newMinutes * 60);
  }, []);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');

  // Urgent warning when less than 10 minutes (600 seconds) remain and not finished
  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 600;

  return {
    remainingSeconds,
    formattedTime,
    isUrgent,
    isFinished,
    finishContest,
    resetTimer
  };
}
