import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Track } from 'api';
import { playbackActions } from 'features/playback';
import { queueActions } from 'features/queue';
import React from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { CgRowFirst, CgRowLast } from 'react-icons/cg';
import { FiRadio } from 'react-icons/fi';
import { persistedStore, store } from 'state';

const TrackMenu: React.FC<{ tracks: Track[] }> = ({ tracks }) => {
  const handlePlay = () => {
    playbackActions.playLibraryItems(tracks);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handlePlayRadio = () => {
    playbackActions.playTrackRadio(tracks[0]);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handleAddToQueue = (next = false) => {
    const queueId = persistedStore.queueId.peek();
    if (queueId === 0) {
      playbackActions.playLibraryItems(tracks);
    } else {
      queueActions.addToQueue(tracks, undefined, undefined, next);
    }
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  return (
    <>
      <MenuItem onClick={handlePlay}>
        <ListItemIcon>
          <BsPlayFill />
        </ListItemIcon>
        <ListItemText>Play now</ListItemText>
      </MenuItem>
      {tracks.length === 1 && (
        <MenuItem onClick={handlePlayRadio}>
          <ListItemIcon sx={{ fontSize: '1.15rem' }}>
            <FiRadio viewBox="0 -1 24 24" />
          </ListItemIcon>
          <ListItemText>Play track radio</ListItemText>
        </MenuItem>
      )}
      <MenuItem onClick={() => handleAddToQueue(true)}>
        <ListItemIcon>
          <CgRowFirst />
        </ListItemIcon>
        <ListItemText>Play next</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleAddToQueue()}>
        <ListItemIcon>
          <CgRowLast />
        </ListItemIcon>
        <ListItemText>Add to queue</ListItemText>
      </MenuItem>
    </>
  );
};

export default TrackMenu;
