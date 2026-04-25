import { HStack, VStack, Text, Button, Input } from '@chakra-ui/react';
import type { TaskMeta, Difficulty, FocusLevel } from '@/types/todo';

interface Props {
  meta: TaskMeta;
  onChange: (meta: TaskMeta) => void;
}

const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'low', label: '쉬움', color: 'green' },
  { value: 'mid', label: '보통', color: 'yellow' },
  { value: 'high', label: '어려움', color: 'red' },
];

const FOCUS_LEVELS: { value: FocusLevel; label: string }[] = [
  { value: 'low', label: '낮음' },
  { value: 'mid', label: '보통' },
  { value: 'high', label: '높음' },
];

export function MetaInput({ meta, onChange }: Props) {
  return (
    <VStack gap={2} align="stretch" px={1}>
      <HStack gap={2} flexWrap="wrap">
        <Text fontSize="xs" color="fg.muted" minW="max-content">난이도</Text>
        <HStack gap={1}>
          {DIFFICULTIES.map(d => (
            <Button
              key={d.value}
              size="xs"
              borderRadius="full"
              variant={meta.difficulty === d.value ? 'solid' : 'outline'}
              colorPalette={d.color}
              onClick={() => onChange({ ...meta, difficulty: d.value })}
            >
              {d.label}
            </Button>
          ))}
        </HStack>
      </HStack>

      <HStack gap={2}>
        <Text fontSize="xs" color="fg.muted" minW="max-content">예상 시간</Text>
        <HStack gap={1}>
          <Input
            type="number"
            size="xs"
            w="60px"
            min={1}
            max={480}
            value={meta.estimatedMinutes}
            onChange={e => onChange({ ...meta, estimatedMinutes: Math.max(1, Number(e.target.value)) })}
            borderRadius="lg"
          />
          <Text fontSize="xs" color="fg.muted">분</Text>
        </HStack>
        <HStack gap={1} ml={2}>
          {[5, 15, 30, 60].map(m => (
            <Button
              key={m}
              size="xs"
              variant={meta.estimatedMinutes === m ? 'solid' : 'ghost'}
              colorPalette="gray"
              borderRadius="full"
              onClick={() => onChange({ ...meta, estimatedMinutes: m })}
            >
              {m}분
            </Button>
          ))}
        </HStack>
      </HStack>

      <HStack gap={2} flexWrap="wrap">
        <Text fontSize="xs" color="fg.muted" minW="max-content">집중도</Text>
        <HStack gap={1}>
          {FOCUS_LEVELS.map(f => (
            <Button
              key={f.value}
              size="xs"
              borderRadius="full"
              variant={meta.focusRequired === f.value ? 'solid' : 'outline'}
              colorPalette="purple"
              onClick={() => onChange({ ...meta, focusRequired: f.value })}
            >
              {f.label}
            </Button>
          ))}
        </HStack>
      </HStack>
    </VStack>
  );
}

export const DEFAULT_META: TaskMeta = {
  difficulty: 'mid',
  estimatedMinutes: 30,
  focusRequired: 'mid',
};
