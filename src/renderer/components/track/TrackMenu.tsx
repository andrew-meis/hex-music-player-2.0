import { observer } from '@legendapp/state/react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Track } from 'api';
import { queueActions } from 'audio';
import React from 'react';
import { TiArrowForward } from 'react-icons/ti';
import { store } from 'state';

const TrackMenu: React.FC = observer(function TrackMenu() {
  const tracks = store.ui.menus.items.get() as Track[];

  const handlePlayNext = () => {
    queueActions.addToQueue(tracks, undefined, undefined, true);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  return (
    <>
      <MenuItem onClick={handlePlayNext}>
        <ListItemIcon>
          <TiArrowForward />
        </ListItemIcon>
        <ListItemText>Play next</ListItemText>
      </MenuItem>
    </>
  );
});

export default TrackMenu;
