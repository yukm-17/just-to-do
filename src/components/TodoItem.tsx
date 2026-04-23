import { useState, useRef, useEffect } from 'react';
import {
  HStack,
  Text,
  IconButton,
  Input,
  Box,
  CheckboxRoot,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxHiddenInput,
} from '@chakra-ui/react';
import type { Todo } from '../types/todo';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    onEdit(todo.id, editValue);
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(todo.text);
    setEditing(false);
  };

  return (
    <Box
      borderRadius="xl"
      px={4}
      py={3}
      bg="bg.subtle"
      _hover={{ bg: 'bg.muted' }}
      transition="background 0.15s"
    >
      <HStack gap={3}>
        <CheckboxRoot
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          colorPalette="purple"
          size="lg"
          flexShrink={0}
        >
          <CheckboxHiddenInput />
          <CheckboxControl borderRadius="md">
            <CheckboxIndicator />
          </CheckboxControl>
        </CheckboxRoot>

        {editing ? (
          <HStack flex={1} gap={1}>
            <Input
              ref={inputRef}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              size="sm"
              borderRadius="lg"
              flex={1}
            />
            <IconButton
              aria-label="Save"
              size="sm"
              colorPalette="green"
              variant="ghost"
              onClick={commitEdit}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              aria-label="Cancel"
              size="sm"
              colorPalette="red"
              variant="ghost"
              onClick={cancelEdit}
            >
              <CloseIcon />
            </IconButton>
          </HStack>
        ) : (
          <>
            <Text
              flex={1}
              fontSize="md"
              textDecoration={todo.completed ? 'line-through' : 'none'}
              color={todo.completed ? 'fg.muted' : 'fg'}
              wordBreak="break-word"
            >
              {todo.text}
            </Text>
            <HStack gap={0} flexShrink={0}>
              <IconButton
                aria-label="Edit"
                size="sm"
                variant="ghost"
                colorPalette="blue"
                onClick={() => setEditing(true)}
                disabled={todo.completed}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="Delete"
                size="sm"
                variant="ghost"
                colorPalette="red"
                onClick={() => onDelete(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </HStack>
          </>
        )}
      </HStack>
    </Box>
  );
}
