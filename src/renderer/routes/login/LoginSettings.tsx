import { Box, Button, Switch, Typography, useColorScheme } from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Typography level="h3">Settings</Typography>
      <Box alignItems="center" display="flex" justifyContent="space-between" mt={2}>
        <Typography sx={{ fontWeight: 600 }} level="title-lg">
          Dark Mode
        </Typography>
        <Switch
          checked={mode === 'dark'}
          size="lg"
          onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
        />
      </Box>
      <Button
        sx={{
          mt: 3,
        }}
        variant="soft"
        onClick={navigateHome}
      >
        Finish
      </Button>
    </motion.div>
  );
};

export default LoginSettings;
