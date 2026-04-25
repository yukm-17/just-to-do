import { useState, useEffect } from 'react';
import type { Todo, FilterType, TaskMeta } from '@/types/todo';

const STORAGE_KEY = 'just-to-do-items';

function makeTodo(text: string, meta?: TaskMeta): Todo {
  return { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now(), children: [], collapsed: false, meta };
}

function migrate(t: any): Todo {
  return {
    id: t.id, text: t.text, completed: t.completed, createdAt: t.createdAt,
    children: Array.isArray(t.children) ? t.children.map(migrate) : [],
    collapsed: t.collapsed ?? false,
    meta: t.meta,
  };
}

function mapNode(todos: Todo[], id: string, fn: (t: Todo) => Todo): Todo[] {
  return todos.map(t => t.id === id ? fn(t) : { ...t, children: mapNode(t.children, id, fn) });
}

function filterNode(todos: Todo[], id: string): Todo[] {
  return todos.filter(t => t.id !== id).map(t => ({ ...t, children: filterNode(t.children, id) }));
}

function removeCompleted(todos: Todo[]): Todo[] {
  return todos.filter(t => !t.completed).map(t => ({ ...t, children: removeCompleted(t.children) }));
}

function countAll(todos: Todo[]): { active: number; completed: number } {
  let active = 0, completed = 0;
  const walk = (items: Todo[]) => {
    for (const t of items) { t.completed ? completed++ : active++; walk(t.children); }
  };
  walk(todos);
  return { active, completed };
}

// 아이템을 트리에서 제거하고 반환
function removeAndGet(todos: Todo[], id: string): [Todo | null, Todo[]] {
  let found: Todo | null = null;
  const result = todos
    .filter(t => { if (t.id === id) { found = t; return false; } return true; })
    .map(t => {
      if (found) return t;
      const [f, children] = removeAndGet(t.children, id);
      if (f) { found = f; return { ...t, children }; }
      return t;
    });
  return [found, result];
}

function isDescendant(todo: Todo, targetId: string): boolean {
  return todo.children.some(c => c.id === targetId || isDescendant(c, targetId));
}

function insertAt(todos: Todo[], item: Todo, parentId: string | null, index: number): Todo[] {
  if (parentId === null) {
    const result = [...todos];
    result.splice(Math.min(index, result.length), 0, item);
    return result;
  }
  return todos.map(t => {
    if (t.id === parentId) {
      const children = [...t.children];
      children.splice(Math.min(index, children.length), 0, item);
      return { ...t, children, collapsed: false };
    }
    return { ...t, children: insertAt(t.children, item, parentId, index) };
  });
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).map(migrate) : [];
    } catch { return []; }
  });
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, meta?: TaskMeta): string => {
    const trimmed = text.trim();
    if (!trimmed) return '';
    const todo = makeTodo(trimmed, meta);
    setTodos(prev => [todo, ...prev]);
    return todo.id;
  };

  const addChild = (parentId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(prev =>
      mapNode(prev, parentId, t => ({
        ...t, collapsed: false,
        children: [makeTodo(trimmed), ...t.children],
      }))
    );
  };

  const updateMeta = (id: string, meta: TaskMeta | undefined) => {
    setTodos(prev => mapNode(prev, id, t => ({ ...t, meta })));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => mapNode(prev, id, t => ({ ...t, completed: !t.completed })));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => filterNode(prev, id));
  };

  const editTodo = (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(prev => mapNode(prev, id, t => ({ ...t, text: trimmed })));
  };

  const toggleCollapse = (id: string) => {
    setTodos(prev => mapNode(prev, id, t => ({ ...t, collapsed: !t.collapsed })));
  };

  // 아이템을 트리 내 임의 위치로 이동 (같은 레벨 정렬 + 상위/하위 이동 모두 처리)
  const reparentItem = (activeId: string, newParentId: string | null, newIndex: number) => {
    setTodos(prev => {
      const [item, tree] = removeAndGet(prev, activeId);
      if (!item) return prev;
      if (newParentId && isDescendant(item, newParentId)) return prev;
      return insertAt(tree, item, newParentId, newIndex);
    });
  };

  const clearCompleted = () => {
    setTodos(prev => removeCompleted(prev));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const { active: activeCount, completed: completedCount } = countAll(todos);

  return {
    todos, filteredTodos, filter, setFilter,
    addTodo, addChild, toggleTodo, deleteTodo, editTodo, updateMeta,
    toggleCollapse, reparentItem, clearCompleted,
    activeCount, completedCount,
  };
}
