import { Box, HStack, Button, Text } from '@chakra-ui/react';
import { ENERGY_CONFIG, type EnergyLevel } from '@/types/energy';

interface Props {
  value: EnergyLevel;
  onChange: (v: EnergyLevel) => void;
}

const LEVELS: EnergyLevel[] = ['low', 'normal', 'high'];

export function EnergySelector({ value, onChange }: Props) {
  const cfg = ENERGY_CONFIG[value];

  return (
    <Box>
      <HStack gap={2} justify="center" mb={2}>
        {LEVELS.map(level => {
          const c = ENERGY_CONFIG[level];
          const isSelected = value === level;
          return (
            <Button
              key={level}
              size="sm"
              variant={isSelected ? 'solid' : 'outline'}
              colorPalette={c.color}
              borderRadius="full"
              onClick={() => onChange(level)}
              fontWeight={isSelected ? 'bold' : 'normal'}
              gap={1}
            >
              {c.emoji} {c.label}
            </Button>
          );
        })}
      </HStack>
      <Text fontSize="xs" color="fg.muted" textAlign="center">
        {cfg.description}
      </Text>
    </Box>
  );
}
