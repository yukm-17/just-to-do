import { useState } from 'react';
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

const PRESETS = [5, 10, 15, 20, 25, 30];

const selectStyle: React.CSSProperties = {
  fontSize: '14px',
  padding: '6px 10px',
  borderRadius: '8px',
  border: '1px solid var(--chakra-colors-border)',
  background: 'var(--chakra-colors-bg-subtle)',
  color: 'inherit',
  outline: 'none',
  cursor: 'pointer',
};

export function MetaInput({ meta, onChange }: Props) {
  const isCustom = !PRESETS.includes(meta.estimatedMinutes);
  const [showCustomInput, setShowCustomInput] = useState(isCustom);
  const [customValue, setCustomValue] = useState(
    isCustom ? String(meta.estimatedMinutes) : ''
  );

  const handleTimeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setShowCustomInput(true);
      setCustomValue('');
    } else {
      setShowCustomInput(false);
      onChange({ ...meta, estimatedMinutes: Number(val) });
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomValue(raw);
    const n = Number(raw);
    if (n > 0) onChange({ ...meta, estimatedMinutes: n });
  };

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

      <HStack gap={2} flexWrap="wrap">
        <Text fontSize="xs" color="fg.muted" minW="max-content">예상 시간</Text>
        {showCustomInput && (
          <HStack gap={1}>
            <Input
              type="text"
              inputMode="numeric"
              size="xs"
              w="60px"
              borderRadius="lg"
              value={customValue}
              onChange={handleCustomChange}
              placeholder="분"
            />
            <Text fontSize="xs" color="fg.muted">분</Text>
          </HStack>
        )}
        <select
          value={showCustomInput ? 'custom' : meta.estimatedMinutes}
          onChange={handleTimeSelect}
          style={selectStyle}
        >
          {PRESETS.map(m => (
            <option key={m} value={m}>{m}분</option>
          ))}
          <option value="custom">직접입력</option>
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
