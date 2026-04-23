import { useState, useRef } from 'react';
import { HStack, Input, IconButton } from '@chakra-ui/react';

interface Props {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    onAdd(value);
    setValue('');
    inputRef.current?.focus();
  };

  return (
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
  );
}
