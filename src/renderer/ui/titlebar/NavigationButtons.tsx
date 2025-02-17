import { observer } from '@legendapp/state/react';
import { Box, IconButton } from '@mui/material';
import React from 'react';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { store } from 'state';

window.api.onNavigationUpdate((_, args) => {
  store.ui.navigation.set(args);
});

const NavigationButtons: React.FC = observer(function NavigationButtons() {
  const navigate = useNavigate();

  const { canGoBack, canGoForward } = store.ui.navigation.get();

  return (
    <Box display="flex" justifySelf="start">
      <IconButton disabled={!canGoBack} onClick={() => navigate(-1)}>
        <VscChevronLeft />
      </IconButton>
      <IconButton disabled={!canGoForward} onClick={() => navigate(1)}>
        <VscChevronRight />
      </IconButton>
    </Box>
  );
});

export default NavigationButtons;
