import { observer, reactive } from '@legendapp/state/react';
import { Box, IconButton } from '@mui/material';
import React from 'react';
import { LuLibrary } from 'react-icons/lu';
import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { store } from 'state';

window.api.onNavigationUpdate((_, args) => {
  store.ui.navigation.set(args);
});

const ReactiveIconButton = reactive(IconButton);

const NavigationButtons: React.FC = observer(function NavigationButtons() {
  const navigate = useNavigate();

  const { backward, forward } = store.ui.navigation.get();

  return (
    <Box display="flex" justifySelf="start">
      <ReactiveIconButton
        $className={() => (store.ui.drawers.library.open.get() ? 'selected' : '')}
        onClick={() => store.ui.drawers.library.open.set(true)}
      >
        <LuLibrary />
      </ReactiveIconButton>
      <IconButton disabled={!backward} onClick={() => navigate(-1)}>
        <VscChevronLeft />
      </IconButton>
      <IconButton disabled={!forward} onClick={() => navigate(1)}>
        <VscChevronRight />
      </IconButton>
    </Box>
  );
});

export default NavigationButtons;
