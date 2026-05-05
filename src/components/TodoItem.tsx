import { useState, useRef, useEffect } from 'react';
import {
  HStack, VStack, Box, Text, IconButton, Badge, Button,
  CheckboxRoot, CheckboxControl, CheckboxIndicator, CheckboxHiddenInput,
} from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Todo } from '@/types/todo';
import type { TreeHandlers } from '@/types/handlers';
import { MetaInput, DEFAULT_META } from './MetaInput';

const INDENT = 20;

interface Props extends TreeHandlers {
  todo: Todo;
  depth: number;
}

function MoreIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  );
}

function DragHandleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
      <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
      <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
    </svg>
  );
}

export function TodoItem({
  todo, depth,
  onReparent: _onReparent,
  onToggle, onDelete, onEdit,
  onAddChild: _onAddChild,
  onToggleCollapse: _onToggleCollapse,
  onUpdateMeta,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id });

  useEffect(() => { if (editing) editRef.current?.focus(); }, [editing]);

  const commitEdit = () => {
    if (editValue.trim()) onEdit(todo.id, editValue);
    else setEditValue(todo.text);
    setEditing(false);
  };
  const cancelEdit = () => { setEditValue(todo.text); setEditing(false); };

  const startEdit = () => {
    if (todo.completed) return;
    setEditValue(todo.text);
    setEditing(true);
  };

  const meta = todo.meta;

  const DIFF_COLOR = { low: 'green', mid: 'yellow', high: 'red' } as const;
  const DIFF_LABEL = { low: '쉬움', mid: '보통', high: '어려움' } as const;
  const FOCUS_LABEL = { low: '낮음', mid: '보통', high: '높음' } as const;

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        paddingLeft: `${depth * INDENT}px`,
      }}
      opacity={isDragging ? 0.3 : 1}
    >
      <Box
        borderRadius="xl"
        px={3}
        py={2}
        _hover={{ bg: 'bg.subtle' }}
        transition="background 0.15s"
      >
        <HStack gap={1.5} align="start">
          {/* 드래그 핸들 */}
          <Box
            ref={setActivatorNodeRef}
            {...listeners}
            cursor="grab"
            _active={{ cursor: 'grabbing' }}
            color="fg.muted"
            flexShrink={0}
            style={{ touchAction: 'none' }}
            p={0.5}
          >
            <DragHandleIcon />
          </Box>

          {/* 체크박스 + 내용 그룹 */}
          <HStack gap={2} flex={1} minW={0} align="start">
            <CheckboxRoot
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              colorPalette="purple"
              flexShrink={0}
            >
              <CheckboxHiddenInput />
              <CheckboxControl borderRadius="md"><CheckboxIndicator /></CheckboxControl>
            </CheckboxRoot>

            <VStack gap={0.5} flex={1} align="start" minW={0}>
              {editing ? (
                <input
                  ref={editRef}
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) commitEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  onBlur={commitEdit}
                  style={{
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    color: 'inherit',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid currentColor',
                    outline: 'none',
                    padding: 0,
                    margin: 0,
                    width: '100%',
                    lineHeight: '1.5',
                    opacity: 0.85,
                  }}
                />
              ) : (
                <Text
                  fontSize="sm"
                  wordBreak="break-word"
                  textDecoration={todo.completed ? 'line-through' : 'none'}
                  color={todo.completed ? 'fg.muted' : 'fg'}
                  cursor={todo.completed ? 'default' : 'text'}
                  onClick={startEdit}
                  w="full"
                >
                  {todo.text}
                </Text>
              )}

              {/* 메타 태그 - 설정된 경우에만 표시 */}
              {!editing && meta && (
                <HStack gap={1} flexWrap="wrap">
                  <Badge size="sm" colorPalette="gray" borderRadius="full" variant="subtle">
                    ⏱ {meta.estimatedMinutes}분
                  </Badge>
                  <Badge size="sm" colorPalette={DIFF_COLOR[meta.difficulty]} borderRadius="full" variant="subtle">
                    {DIFF_LABEL[meta.difficulty]}
                  </Badge>
                  <Badge size="sm" colorPalette="purple" borderRadius="full" variant="subtle">
                    집중 {FOCUS_LABEL[meta.focusRequired]}
                  </Badge>
                </HStack>
              )}
            </VStack>
          </HStack>

          {/* ... 버튼 (설정 패널 토글) */}
          {!editing && (
            <IconButton
              aria-label={settingsOpen ? '설정 접기' : '설정 펼치기'}
              size="sm"
              variant={settingsOpen ? 'subtle' : 'ghost'}
              colorPalette={settingsOpen ? 'purple' : 'gray'}
              flexShrink={0}
              onClick={() => setSettingsOpen(v => !v)}
            >
              <MoreIcon />
            </IconButton>
          )}
        </HStack>

        {/* 설정 패널 */}
        {settingsOpen && (
          <Box mt={2} pt={2} borderTop="1px solid" borderColor="border.subtle">
            <MetaInput
              meta={meta || DEFAULT_META}
              onChange={newMeta => onUpdateMeta(todo.id, newMeta)}
            />
            <HStack justify="flex-end" mt={2}>
              <Button
                size="xs"
                colorPalette="red"
                variant="ghost"
                onClick={() => onDelete(todo.id)}
              >
                삭제
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
