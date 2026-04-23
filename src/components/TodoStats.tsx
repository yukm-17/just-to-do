import { HStack, Text, Button, Badge } from '@chakra-ui/react';

interface Props {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function TodoStats({ activeCount, completedCount, onClearCompleted }: Props) {
  return (
    <HStack justify="space-between" fontSize="sm" color="fg.muted">
      <HStack gap={2}>
        <Text>남은 항목</Text>
        <Badge colorPalette="purple" borderRadius="full" px={2}>
          {activeCount}
        </Badge>
      </HStack>
      {completedCount > 0 && (
        <Button
          size="xs"
          variant="ghost"
          colorPalette="gray"
          onClick={onClearCompleted}
        >
          완료 항목 삭제
        </Button>
      )}
    </HStack>
  );
}
