import { reactive } from '@legendapp/state/react';
import { Box, ClickAwayListener, Drawer, Typography } from '@mui/material';
import React from 'react';
import { store } from 'state';

const ReactiveDrawer = reactive(Drawer);

const PlaylistsDrawer: React.FC = () => {
  const handleClose = (event: MouseEvent | TouchEvent) => {
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-invisible')) {
      return;
    }
    if ((event.target as HTMLElement).classList.contains('MuiBackdrop-root')) {
      store.ui.drawers.playlists.open.set(false);
    }
  };

  return (
    <ReactiveDrawer $open={() => store.ui.drawers.playlists.open.get()} anchor="right">
      <ClickAwayListener onClickAway={handleClose}>
        <Box display="flex" flexDirection="column" height={1}>
          <Typography paddingX={1} variant="h5">
            Playlists
          </Typography>
        </Box>
      </ClickAwayListener>
    </ReactiveDrawer>
  );
};

export default PlaylistsDrawer;
