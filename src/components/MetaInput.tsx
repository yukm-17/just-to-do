import { HStack, VStack, Text, Button } from '@chakra-ui/react';
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
        <select
          value={meta.estimatedMinutes}
          onChange={e => onChange({ ...meta, estimatedMinutes: Number(e.target.value) })}
          style={{
            fontSize: '12px',
            padding: '2px 6px',
            borderRadius: '8px',
            border: '1px solid var(--chakra-colors-border)',
            background: 'var(--chakra-colors-bg-subtle)',
            color: 'inherit',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {[5, 10, 15, 20, 30, 45, 60, 90, 120].map(m => (
            <option key={m} value={m}>{m}분</option>
          ))}
        </select>
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
