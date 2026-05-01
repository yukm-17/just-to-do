import { useState } from 'react';
import { Box, HStack, VStack, Text, CheckboxRoot, CheckboxControl, CheckboxIndicator, CheckboxHiddenInput } from '@chakra-ui/react';
import type { ScoredTodo } from '@/types/energy';

interface Props {
  item: ScoredTodo;
  onComplete: (id: string) => void;
  feedback?: string | null;
}

export function TaskCard({ item, onComplete, feedback }: Props) {
  const [done, setDone] = useState(item.todo.completed);
  const { todo, parentText } = item;

  const handleChange = () => {
    if (done) return;
    setDone(true);
    onComplete(todo.id);
  };

  return (
    <Box
      bg={done ? 'bg.muted' : 'bg.subtle'}
      borderRadius="xl"
      px={4}
      py={3}
      opacity={done ? 0.6 : 1}
      transition="all 0.2s"
      borderLeft={feedback ? '3px solid' : undefined}
      borderColor="purple.400"
    >
      <HStack gap={3} align="start">
        <CheckboxRoot
          checked={done}
          onCheckedChange={handleChange}
          colorPalette="purple"
          flexShrink={0}
          mt={0.5}
        >
          <CheckboxHiddenInput />
          <CheckboxControl borderRadius="md"><CheckboxIndicator /></CheckboxControl>
        </CheckboxRoot>

        <VStack gap={0.5} align="start" flex={1}>
          {parentText && (
            <Text fontSize="xs" color="fg.muted">↳ {parentText}</Text>
          )}
          <Text
            fontSize="sm"
            fontWeight="medium"
            textDecoration={done ? 'line-through' : 'none'}
            color={done ? 'fg.muted' : 'fg'}
          >
            {todo.text}
          </Text>
        </VStack>
      </HStack>

      {feedback && (
        <Text fontSize="xs" color="purple.500" fontWeight="bold" textAlign="right" mt={1}>
          {feedback}
        </Text>
      )}
    </Box>
  );
}
