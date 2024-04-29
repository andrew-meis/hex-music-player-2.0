import { Box, Button, Switch, Typography, useColorScheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSettings: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mode, setMode } = useColorScheme();

  const navigateHome = async () => {
    setTimeout(() => {
      queryClient.removeQueries({ queryKey: ['auth-token'] });
      queryClient.removeQueries({ queryKey: ['servers'] });
      queryClient.removeQueries({ queryKey: ['server-connection'] });
      queryClient.removeQueries({ queryKey: ['library-sections'] });
    }, 1000);
    navigate('/');
  };

  return (
    <>
      <Typography variant="h3">Settings</Typography>
      <Box alignItems="center" display="flex" justifyContent="space-between" mt={2}>
        <Typography sx={{ fontWeight: 600 }} variant="body1">
          Dark Mode
        </Typography>
        <Switch
          checked={mode === 'dark'}
          size="medium"
          onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
        />
      </Box>
      <Button
        sx={{
          borderRadius: 16,
          mt: 3,
        }}
        variant="outlined"
        onClick={navigateHome}
      >
        Finish
      </Button>
    </>
  );
};

export default LoginSettings;
