import { useState, useRef } from 'react';
import { HStack, VStack, Input, IconButton, Button, Box } from '@chakra-ui/react';
import { MetaInput, DEFAULT_META } from './MetaInput';
import type { TaskMeta } from '@/types/todo';

interface Props {
  onAdd: (text: string, meta?: TaskMeta) => void;
}

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [showMeta, setShowMeta] = useState(false);
  const [meta, setMeta] = useState<TaskMeta>(DEFAULT_META);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onAdd(value, showMeta ? meta : undefined);
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <VStack gap={2} align="stretch">
      <HStack gap={2}>
        <Input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSubmit()}
          placeholder="할 일을 입력하세요..."
          size="lg"
          borderRadius="xl"
          fontSize="md"
          flex={1}
        />
        <IconButton
          aria-label="Add todo"
          onClick={handleSubmit}
          size="lg"
          colorPalette="purple"
          borderRadius="xl"
          disabled={!value.trim()}
          flexShrink={0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </IconButton>
      </HStack>

      <Button
        size="xs"
        variant="ghost"
        colorPalette="gray"
        alignSelf="flex-start"
        onClick={() => setShowMeta(v => !v)}
        color="fg.muted"
      >
        {showMeta ? '▲ 상세 숨기기' : '▼ 난이도 · 시간 · 집중도 설정'}
      </Button>

      {showMeta && (
        <Box bg="bg.subtle" borderRadius="xl" p={3}>
          <MetaInput meta={meta} onChange={setMeta} />
        </Box>
      )}
    </VStack>
  );
}
