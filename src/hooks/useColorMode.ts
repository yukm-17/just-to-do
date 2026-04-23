import { useState, useEffect } from 'react';

type ColorMode = 'light' | 'dark';

export function useColorMode() {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem('color-mode');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = colorMode;
    localStorage.setItem('color-mode', colorMode);
  }, [colorMode]);

  const toggleColorMode = () =>
    setColorMode(prev => (prev === 'light' ? 'dark' : 'light'));

  return { colorMode, toggleColorMode };
}
