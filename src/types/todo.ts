export type FilterType = 'all' | 'active' | 'completed';
export type Difficulty = 'low' | 'mid' | 'high';
export type FocusLevel = 'low' | 'mid' | 'high';

export interface TaskMeta {
  difficulty: Difficulty;
  estimatedMinutes: number;
  focusRequired: FocusLevel;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  children: Todo[];
  collapsed: boolean;
  meta?: TaskMeta;
}
