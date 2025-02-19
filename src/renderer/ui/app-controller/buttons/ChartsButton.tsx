import { reactive } from '@legendapp/state/react';
import { IconButton } from '@mui/material';
import React from 'react';
import { TiChartLine } from 'react-icons/ti';
import { store } from 'state';

const ReactiveIconButton = reactive(IconButton);

const ChartsButton: React.FC = () => {
  const handleButtonClick = () => store.ui.drawers.charts.open.toggle();

  return (
    <ReactiveIconButton
      $className={() => (store.ui.drawers.charts.open.get() ? 'selected' : '')}
      sx={{
        fontSize: '1.5rem',
      }}
      onClick={handleButtonClick}
    >
      <TiChartLine />
    </ReactiveIconButton>
  );
};

export default ChartsButton;
