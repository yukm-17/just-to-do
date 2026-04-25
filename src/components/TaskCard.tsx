import { useState } from 'react';
import { Box, HStack, VStack, Text, Badge, CheckboxRoot, CheckboxControl, CheckboxIndicator, CheckboxHiddenInput } from '@chakra-ui/react';
import type { ScoredTodo } from '@/types/energy';

interface Props {
  item: ScoredTodo;
  onComplete: (id: string) => void;
  feedback?: string | null;
}

const DIFF_LABEL: Record<string, { label: string; color: string }> = {
  low: { label: '쉬움', color: 'green' },
  mid: { label: '보통', color: 'yellow' },
  high: { label: '어려움', color: 'red' },
};
const FOCUS_LABEL: Record<string, string> = {
  low: '집중 낮음',
  mid: '집중 보통',
  high: '집중 높음',
};

export function TaskCard({ item, onComplete, feedback }: Props) {
  const [done, setDone] = useState(item.todo.completed);
  const { todo, reason, parentText } = item;
  const meta = todo.meta;

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

        <VStack gap={1} align="start" flex={1}>
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

          {meta && (
            <HStack gap={1} flexWrap="wrap">
              <Badge size="sm" colorPalette="gray" borderRadius="full" variant="subtle">
                ⏱ {meta.estimatedMinutes}분
              </Badge>
              <Badge
                size="sm"
                colorPalette={DIFF_LABEL[meta.difficulty].color}
                borderRadius="full"
                variant="subtle"
              >
                {DIFF_LABEL[meta.difficulty].label}
              </Badge>
              <Badge size="sm" colorPalette="purple" borderRadius="full" variant="subtle">
                {FOCUS_LABEL[meta.focusRequired]}
              </Badge>
            </HStack>
          )}

          <Text fontSize="xs" color="purple.500" fontStyle="italic">
            {reason}
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
