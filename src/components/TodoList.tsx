import { useState, useMemo, useCallback } from 'react';
import {
  DndContext, closestCenter, DragOverlay,
  type DragStartEvent, type DragMoveEvent, type DragEndEvent,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Box, VStack, Text } from '@chakra-ui/react';
import type { Todo } from '@/types/todo';
import type { TreeHandlers } from '@/types/handlers';
import { TodoItem } from './TodoItem';

const INDENT = 20; // px per depth level

interface FlatItem {
  id: string;
  parentId: string | null;
  depth: number;
  todo: Todo;
}

function flatten(todos: Todo[], parentId: string | null = null, depth = 0): FlatItem[] {
  return todos.flatMap(todo => {
    const item: FlatItem = { id: todo.id, parentId, depth, todo };
    if (todo.collapsed) return [item];
    return [item, ...flatten(todo.children, todo.id, depth + 1)];
  });
}

function countDescendants(todo: Todo): number {
  return todo.children.reduce((n, c) => n + 1 + countDescendants(c), 0);
}

/**
 * 드래그 종료 시 새 위치(parentId, index)를 계산한다.
 *
 * delta.x > 0 → 더 깊게(자식으로), delta.x < 0 → 더 얕게(상위로)
 */
function calcProjected(
  flatItems: FlatItem[],
  activeId: string,
  overId: string,
  deltaX: number,
): { parentId: string | null; index: number; depth: number } {
  const activeIdx = flatItems.findIndex(i => i.id === activeId);
  const overIdx = flatItems.findIndex(i => i.id === overId);
  const origDepth = flatItems[activeIdx].depth;
  const depthDelta = Math.round(deltaX / INDENT);

  // 위로 드래그하면서 더 깊게 → over 아이템 뒤에 삽입
  const adjustedOverIdx =
    activeIdx > overIdx && depthDelta > 0
      ? Math.min(overIdx + 1, flatItems.length - 1)
      : overIdx;

  const newOrder = arrayMove(flatItems, activeIdx, adjustedOverIdx);
  const newActiveIdx = newOrder.findIndex(i => i.id === activeId);

  const maxDepth = newActiveIdx > 0 ? newOrder[newActiveIdx - 1].depth + 1 : 0;
  const minDepth =
    newActiveIdx < newOrder.length - 1 ? newOrder[newActiveIdx + 1].depth : 0;
  const newDepth = Math.max(minDepth, Math.min(origDepth + depthDelta, maxDepth));

  // 새 parentId: 앞에서 depth = newDepth-1 인 가장 가까운 아이템
  let parentId: string | null = null;
  if (newDepth > 0) {
    for (let i = newActiveIdx - 1; i >= 0; i--) {
      if (newOrder[i].depth === newDepth - 1) { parentId = newOrder[i].id; break; }
      if (newOrder[i].depth < newDepth - 1) break;
    }
  }

  // 같은 부모 아래 형제 중 몇 번째인지 계산
  let index = 0;
  for (let i = 0; i < newActiveIdx; i++) {
    if (newOrder[i].id === activeId || newOrder[i].depth !== newDepth) continue;
    // 이 아이템의 projected parent를 구해 비교
    let projParent: string | null = null;
    if (newDepth > 0) {
      for (let j = i - 1; j >= 0; j--) {
        if (newOrder[j].depth === newDepth - 1) { projParent = newOrder[j].id; break; }
        if (newOrder[j].depth < newDepth - 1) break;
      }
    }
    if (projParent === parentId) index++;
  }

  return { parentId, index, depth: newDepth };
}

interface Props extends TreeHandlers {
  todos: Todo[];
}

export function TodoList({ todos, onReparent, ...handlers }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [deltaX, setDeltaX] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const allFlat = useMemo(() => flatten(todos), [todos]);

  // 드래그 중 active 아이템의 자식들은 목록에서 숨김 (자식 포함 이동)
  const flatItems = useMemo(() => {
    if (!activeId) return allFlat;
    const activeIdx = allFlat.findIndex(i => i.id === activeId);
    if (activeIdx === -1) return allFlat;
    const activeDepth = allFlat[activeIdx].depth;
    return allFlat.filter((item, idx) => {
      if (item.id === activeId) return true;
      if (idx <= activeIdx) return true;
      return item.depth <= activeDepth;
    });
  }, [allFlat, activeId]);

  const activeFlat = useMemo(
    () => allFlat.find(i => i.id === activeId) ?? null,
    [allFlat, activeId]
  );

  // DragOverlay에 표시할 projected depth (가로 이동에 따라 실시간 업데이트)
  const projectedDepth = useMemo(() => {
    if (!activeFlat || !overId) return activeFlat?.depth ?? 0;
    return calcProjected(flatItems, activeFlat.id, overId, deltaX).depth;
  }, [activeFlat, overId, deltaX, flatItems]);

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
    setDeltaX(0);
  }, []);

  const handleDragMove = useCallback(({ delta, over }: DragMoveEvent) => {
    setDeltaX(delta.x);
    setOverId(over ? String(over.id) : null);
  }, []);

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    const aid = String(active.id);
    setActiveId(null);
    setOverId(null);
    setDeltaX(0);

    if (!over || active.id === over.id) return;

    const { parentId, index } = calcProjected(
      allFlat, aid, String(over.id), deltaX
    );
    onReparent(aid, parentId, index);
  }, [allFlat, deltaX, onReparent]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
    setDeltaX(0);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={flatItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <VStack gap={1} align="stretch">
          {flatItems.map(item => (
            <TodoItem
              key={item.id}
              todo={item.todo}
              depth={item.depth}
              onReparent={onReparent}
              {...handlers}
            />
          ))}
        </VStack>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeFlat && (
          <OverlayItem
            todo={activeFlat.todo}
            depth={projectedDepth}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

function OverlayItem({ todo, depth }: { todo: Todo; depth: number }) {
  const count = countDescendants(todo);
  return (
    <Box style={{ paddingLeft: `${depth * INDENT}px` }} opacity={0.9} cursor="grabbing">
      <Box bg="bg.panel" borderRadius="xl" px={3} py={2} shadow="xl" borderWidth="1px" borderColor="purple.400">
        <Text fontSize="sm" color={todo.completed ? 'fg.muted' : 'fg'}
          textDecoration={todo.completed ? 'line-through' : 'none'}>
          {todo.text}
          {count > 0 && (
            <Text as="span" color="purple.400" fontSize="xs" ml={1}>+{count}</Text>
          )}
        </Text>
      </Box>
    </Box>
  );
}
