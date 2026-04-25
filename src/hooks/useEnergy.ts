import { useState, useEffect } from 'react';
import type { EnergyLevel } from '@/types/energy';

export function useEnergy() {
  const [energy, setEnergy] = useState<EnergyLevel>(() => {
    return (localStorage.getItem('energy-level') as EnergyLevel) || 'normal';
  });

  useEffect(() => {
    localStorage.setItem('energy-level', energy);
  }, [energy]);

  return { energy, setEnergy };
}
