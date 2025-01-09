import { reactive } from '@legendapp/state/react';
import { Box, ClickAwayListener, Drawer } from '@mui/material';
import React from 'react';
import { store } from 'state';

import Queue from './Queue';

const ReactiveDrawer = reactive(Drawer);

const QueueDrawer: React.FC = () => {
  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-invisible')) {
      return;
    }
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.drawers.queue.open.set(false);
    }
  };

  return (
    <ReactiveDrawer $open={() => store.ui.drawers.queue.open.get()} anchor="right">
      <ClickAwayListener onClickAway={handleClose}>
        <Box display="flex" flexDirection="column" height={1}>
          <Queue />
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default QueueDrawer;
