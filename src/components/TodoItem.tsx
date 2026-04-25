import { useState, useRef, useEffect } from 'react';
import {
  HStack, VStack, Box, Text, Input, IconButton, Badge,
  CheckboxRoot, CheckboxControl, CheckboxIndicator, CheckboxHiddenInput,
} from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Todo } from '@/types/todo';
import type { TreeHandlers } from '@/types/handlers';

const INDENT = 20;

interface Props extends TreeHandlers {
  todo: Todo;
  depth: number;
}

function GripIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
      <circle cx="2.5" cy="2" r="1.5"/><circle cx="7.5" cy="2" r="1.5"/>
      <circle cx="2.5" cy="7" r="1.5"/><circle cx="7.5" cy="7" r="1.5"/>
      <circle cx="2.5" cy="12" r="1.5"/><circle cx="7.5" cy="12" r="1.5"/>
    </svg>
  );
}
function ChevronDownIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
}
function ChevronRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
}
function PlusIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function EditIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function DeleteIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
}
function CheckIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function CloseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

export function TodoItem({
  todo, depth,
  onReparent: _onReparent,
  onToggle, onDelete, onEdit, onAddChild, onToggleCollapse,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const [addingChild, setAddingChild] = useState(false);
  const [childText, setChildText] = useState('');
  const editRef = useRef<HTMLInputElement>(null);
  const childRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id });

  useEffect(() => { if (editing) editRef.current?.focus(); }, [editing]);
  useEffect(() => { if (addingChild) childRef.current?.focus(); }, [addingChild]);

  const commitEdit = () => {
    if (editValue.trim()) onEdit(todo.id, editValue);
    else setEditValue(todo.text);
    setEditing(false);
  };
  const cancelEdit = () => { setEditValue(todo.text); setEditing(false); };

  const submitChild = () => {
    if (childText.trim()) onAddChild(todo.id, childText);
    setChildText('');
    setAddingChild(false);
  };
  const cancelChild = () => { setChildText(''); setAddingChild(false); };

  const hasChildren = todo.children.length > 0;

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        paddingLeft: `${depth * INDENT}px`,
      }}
      opacity={isDragging ? 0.3 : 1}
    >
      {/* 메인 행 */}
      <Box
        bg="bg.subtle"
        borderRadius="xl"
        px={3}
        py={2}
        _hover={{ bg: 'bg.muted' }}
        transition="background 0.15s"
      >
        <HStack gap={1.5}>
          {/* 드래그 핸들 */}
          <Box
            {...attributes}
            {...listeners}
            cursor="grab"
            color="fg.muted"
            flexShrink={0}
            px={0.5}
            _active={{ cursor: 'grabbing' }}
            style={{ touchAction: 'none' }}
          >
            <GripIcon />
          </Box>

          {/* 접기/펼치기 */}
          <Box w={5} h={5} flexShrink={0} display="flex" alignItems="center" justifyContent="center">
            {hasChildren && (
              <IconButton
                aria-label={todo.collapsed ? '펼치기' : '접기'}
                size="xs" variant="ghost" minW={0} h="auto" p={0.5}
                onClick={() => onToggleCollapse(todo.id)}
              >
                {todo.collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
              </IconButton>
            )}
          </Box>

          {/* 체크박스 */}
          <CheckboxRoot
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            colorPalette="purple"
            flexShrink={0}
          >
            <CheckboxHiddenInput />
            <CheckboxControl borderRadius="md"><CheckboxIndicator /></CheckboxControl>
          </CheckboxRoot>

          {/* 텍스트 / 수정 */}
          {editing ? (
            <HStack flex={1} gap={1}>
              <Input
                ref={editRef}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) commitEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                size="sm" borderRadius="lg" flex={1}
              />
              <IconButton aria-label="저장" size="sm" variant="ghost" colorPalette="green" onClick={commitEdit}><CheckIcon /></IconButton>
              <IconButton aria-label="취소" size="sm" variant="ghost" colorPalette="red" onClick={cancelEdit}><CloseIcon /></IconButton>
            </HStack>
          ) : (
            <>
              <VStack flex={1} gap={0.5} align="start">
                <Text
                  fontSize="sm" wordBreak="break-word"
                  textDecoration={todo.completed ? 'line-through' : 'none'}
                  color={todo.completed ? 'fg.muted' : 'fg'}
                >
                  {todo.text}
                </Text>
                {todo.meta && (
                  <HStack gap={1} flexWrap="wrap">
                    <Badge size="sm" colorPalette="gray" borderRadius="full" variant="subtle">
                      ⏱ {todo.meta.estimatedMinutes}분
                    </Badge>
                    <Badge
                      size="sm"
                      colorPalette={todo.meta.difficulty === 'low' ? 'green' : todo.meta.difficulty === 'mid' ? 'yellow' : 'red'}
                      borderRadius="full"
                      variant="subtle"
                    >
                      {todo.meta.difficulty === 'low' ? '쉬움' : todo.meta.difficulty === 'mid' ? '보통' : '어려움'}
                    </Badge>
                    <Badge size="sm" colorPalette="purple" borderRadius="full" variant="subtle">
                      집중 {todo.meta.focusRequired === 'low' ? '낮음' : todo.meta.focusRequired === 'mid' ? '보통' : '높음'}
                    </Badge>
                  </HStack>
                )}
              </VStack>
              <HStack gap={0} flexShrink={0}>
                <IconButton aria-label="하위 항목 추가" size="sm" variant="ghost" colorPalette="green" onClick={() => setAddingChild(true)}><PlusIcon /></IconButton>
                <IconButton aria-label="수정" size="sm" variant="ghost" colorPalette="blue" onClick={() => { setEditValue(todo.text); setEditing(true); }} disabled={todo.completed}><EditIcon /></IconButton>
                <IconButton aria-label="삭제" size="sm" variant="ghost" colorPalette="red" onClick={() => onDelete(todo.id)}><DeleteIcon /></IconButton>
              </HStack>
            </>
          )}
        </HStack>
      </Box>

      {/* 하위 항목 추가 인풋 */}
      {addingChild && (
        <Box mt={1} style={{ paddingLeft: `${INDENT}px` }}>
          <Box borderLeft="2px solid" borderColor="purple.400" pl={3}>
            <HStack gap={1}>
              <Input
                ref={childRef}
                value={childText}
                onChange={e => setChildText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) submitChild();
                  if (e.key === 'Escape') cancelChild();
                }}
                placeholder="하위 할 일 입력..."
                size="sm" borderRadius="lg" flex={1}
              />
              <IconButton aria-label="추가" size="sm" colorPalette="purple" onClick={submitChild} disabled={!childText.trim()}><CheckIcon /></IconButton>
              <IconButton aria-label="취소" size="sm" variant="ghost" onClick={cancelChild}><CloseIcon /></IconButton>
            </HStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
