import { useColorScheme } from '@mui/joy';
import { useEffect } from 'react';

const ThemeModeSwitch = () => {
  const { mode } = useColorScheme();

  useEffect(() => {
    mode === 'dark' ? window.api.setMode('dark') : window.api.setMode('light');
  }, [mode]);

  return null;
};

export default ThemeModeSwitch;
