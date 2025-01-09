import { useColorScheme } from '@mui/material';
import { useEffect } from 'react';

const WindowThemeModeSwitch = () => {
  const { mode } = useColorScheme();

  useEffect(() => {
    if (mode === 'dark') {
      window.api.setMode('dark');
    } else {
      window.api.setMode('light');
    }
  }, [mode]);

  return null;
};

export default WindowThemeModeSwitch;
