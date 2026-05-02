import type { TaskMeta } from './todo';

export interface TreeHandlers {
  onReparent: (activeId: string, newParentId: string | null, newIndex: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onAddChild: (parentId: string, text: string) => void;
  onToggleCollapse: (id: string) => void;
  onUpdateMeta: (id: string, meta: TaskMeta | undefined) => void;
}
