import type { Todo } from './todo';

export type EnergyLevel = 'low' | 'normal' | 'high';

export const ENERGY_CONFIG = {
  low: {
    emoji: '😵‍💫',
    label: '지침',
    description: '짧고 쉬운 것부터 시작해요',
    color: 'blue',
    maxSuggested: 3,
  },
  normal: {
    emoji: '😐',
    label: '보통',
    description: '균형 잡힌 작업을 해봐요',
    color: 'green',
    maxSuggested: 5,
  },
  high: {
    emoji: '🔥',
    label: '집중됨',
    description: '깊은 작업을 처리하기 좋아요',
    color: 'orange',
    maxSuggested: 7,
  },
} as const;

export interface ScoredTodo {
  todo: Todo;
  score: number;
  reason: string;
  parentText?: string;
}

export interface RecommendGroup {
  doNow: ScoredTodo[];
  easyPicks: ScoredTodo[];
  defer: ScoredTodo[];
  totalIncomplete: number;
  isOverloaded: boolean;
}
