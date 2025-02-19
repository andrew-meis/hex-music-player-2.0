import { observer } from '@legendapp/state/react';
import { Box, IconButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { VscChevronLeft, VscChevronRight, VscRefresh } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { store } from 'state';

window.api.onNavigationUpdate((_, args) => {
  store.ui.navigation.set(args);
});

const NavigationButtons: React.FC = observer(function NavigationButtons() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { canGoBack, canGoForward } = store.ui.navigation.get();

  return (
    <Box display="flex" justifySelf="start">
      <IconButton disabled={!canGoBack} onClick={() => navigate(-1)}>
        <VscChevronLeft />
      </IconButton>
      <IconButton disabled={!canGoForward} onClick={() => navigate(1)}>
        <VscChevronRight />
      </IconButton>
      <IconButton onClick={() => queryClient.refetchQueries({ type: 'active' })}>
        <VscRefresh style={{ transform: 'rotate(90deg)' }} />
      </IconButton>
    </Box>
  );
});

export default NavigationButtons;
