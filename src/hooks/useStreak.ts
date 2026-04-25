import { useState, useEffect, useCallback } from 'react';

interface StreakData {
  streak: number;
  lastDate: string | null;
  completedToday: number;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

const INITIAL: StreakData = { streak: 0, lastDate: null, completedToday: 0 };

export function useStreak() {
  const [data, setData] = useState<StreakData>(() => {
    try {
      return JSON.parse(localStorage.getItem('streak') || 'null') ?? INITIAL;
    } catch {
      return INITIAL;
    }
  });

  // 날짜가 바뀌었으면 completedToday 초기화, streak 갱신
  useEffect(() => {
    const t = today();
    if (!data.lastDate || data.lastDate === t) return;
    const diff = daysBetween(data.lastDate, t);
    setData(prev => ({
      ...prev,
      completedToday: 0,
      streak: diff > 1 ? 0 : prev.streak,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(data));
  }, [data]);

  const recordCompletion = useCallback(() => {
    const t = today();
    setData(prev => {
      const isNewDay = prev.lastDate !== t;
      let newStreak = prev.streak;
      if (isNewDay) {
        if (!prev.lastDate) {
          newStreak = 1;
        } else {
          const diff = daysBetween(prev.lastDate, t);
          newStreak = diff === 1 ? prev.streak + 1 : 1;
        }
      } else if (prev.streak === 0) {
        newStreak = 1;
      }
      return {
        streak: newStreak,
        lastDate: t,
        completedToday: prev.completedToday + 1,
      };
    });
  }, []);

  return { ...data, recordCompletion };
}
