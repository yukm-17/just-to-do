import type { Todo } from '@/types/todo';
import type { EnergyLevel, ScoredTodo, RecommendGroup } from '@/types/energy';

const OVERLOAD_THRESHOLD = 10;

export function getRecommendations(todos: Todo[], energy: EnergyLevel): RecommendGroup {
  const pool = collectPool(todos, energy, undefined);
  const incomplete = pool.filter(s => !s.todo.completed);

  const sorted = [...incomplete].sort((a, b) => b.score - a.score);

  const doNow = sorted.slice(0, 3);
  const doNowIds = new Set(doNow.map(s => s.todo.id));

  const easyPicks = sorted
    .filter(s => !doNowIds.has(s.todo.id) && isEasyPick(s.todo))
    .slice(0, 5);
  const easyIds = new Set(easyPicks.map(s => s.todo.id));

  const defer = sorted.filter(s => !doNowIds.has(s.todo.id) && !easyIds.has(s.todo.id));

  return {
    doNow,
    easyPicks,
    defer,
    totalIncomplete: incomplete.length,
    isOverloaded: incomplete.length > OVERLOAD_THRESHOLD,
  };
}

// 에너지 레벨에 따라 추천 pool 수집
// low  → leaf node만 (가장 작은 단위)
// high → 모든 task (큰 덩어리 포함)
// normal → 모든 task
function collectPool(
  todos: Todo[],
  energy: EnergyLevel,
  parentText: string | undefined,
): ScoredTodo[] {
  return todos.flatMap(todo => {
    if (todo.completed) return [];

    const item: ScoredTodo = {
      todo,
      score: scoreTask(todo, energy),
      reason: getReasonText(todo, energy),
      parentText,
    };

    if (energy === 'low') {
      const incompleteChildren = todo.children.filter(c => !c.completed);
      if (incompleteChildren.length === 0) return [item];
      return collectPool(todo.children, energy, todo.text);
    }

    return [item, ...collectPool(todo.children, energy, todo.text)];
  });
}

function scoreTask(todo: Todo, energy: EnergyLevel): number {
  const meta = todo.meta;
  if (!meta) return 40;

  const { difficulty, estimatedMinutes, focusRequired } = meta;

  if (energy === 'low') {
    const d = difficulty === 'low' ? 40 : difficulty === 'mid' ? 10 : -15;
    const t = estimatedMinutes <= 10 ? 35 : estimatedMinutes <= 20 ? 20 : estimatedMinutes <= 30 ? 8 : -5;
    const f = focusRequired === 'low' ? 25 : focusRequired === 'mid' ? 5 : -10;
    return d + t + f;
  }

  if (energy === 'normal') {
    const d = difficulty === 'mid' ? 30 : difficulty === 'low' ? 20 : 15;
    const t = estimatedMinutes <= 30 ? 25 : estimatedMinutes <= 60 ? 18 : 10;
    const f = focusRequired === 'mid' ? 25 : 15;
    return d + t + f;
  }

  // high
  const d = difficulty === 'high' ? 45 : difficulty === 'mid' ? 22 : 0;
  const t = estimatedMinutes >= 60 ? 30 : estimatedMinutes >= 30 ? 20 : 5;
  const f = focusRequired === 'high' ? 30 : focusRequired === 'mid' ? 15 : 0;
  return d + t + f;
}

function getReasonText(todo: Todo, energy: EnergyLevel): string {
  const meta = todo.meta;

  if (!meta) {
    if (energy === 'low') return '부담 없이 시작해볼 수 있어요';
    if (energy === 'high') return '지금 처리해볼 수 있어요';
    return '적당한 작업이에요';
  }

  const { difficulty, estimatedMinutes, focusRequired } = meta;

  if (energy === 'low') {
    if (difficulty === 'low' && estimatedMinutes <= 15) return '짧고 쉬워서 지금 딱 맞아요';
    if (difficulty === 'low') return '쉬운 작업이에요';
    if (estimatedMinutes <= 10) return '금방 끝낼 수 있어요';
    if (focusRequired === 'low') return '집중 안 해도 할 수 있어요';
    return '지금 상태에서도 해볼 수 있어요';
  }

  if (energy === 'high') {
    if (difficulty === 'high' && focusRequired === 'high') return '집중됐을 때 처리할 핵심 작업이에요';
    if (difficulty === 'high') return '어렵지만 지금이라면 할 수 있어요';
    if (estimatedMinutes >= 60) return '깊은 작업, 지금이 적기예요';
    if (focusRequired === 'high') return '집중력이 필요한 작업이에요';
    return '지금 에너지로 충분히 할 수 있어요';
  }

  if (difficulty === 'mid') return '적당한 난이도예요';
  if (estimatedMinutes <= 30) return `약 ${estimatedMinutes}분, 부담 없는 분량이에요`;
  return '균형 잡힌 작업이에요';
}

function isEasyPick(todo: Todo): boolean {
  if (!todo.meta) return true;
  return todo.meta.difficulty === 'low' || todo.meta.estimatedMinutes <= 15;
}
