import { HStack, Button } from '@chakra-ui/react';
import type { FilterType } from '@/types/todo';

interface Props {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
}

const OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
];

export function TodoFilter({ filter, onFilterChange }: Props) {
  return (
    <HStack gap={2} justify="center">
      {OPTIONS.map(opt => (
        <Button
          key={opt.value}
          size="sm"
          variant={filter === opt.value ? 'solid' : 'ghost'}
          colorPalette={filter === opt.value ? 'purple' : 'gray'}
          borderRadius="full"
          onClick={() => onFilterChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </HStack>
  );
}
