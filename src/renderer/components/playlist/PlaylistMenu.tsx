import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Playlist } from 'api';
import { playbackActions } from 'features/playback';
import { queueActions } from 'features/queue';
import React from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { CgRowFirst, CgRowLast } from 'react-icons/cg';
import { TbArrowsShuffle } from 'react-icons/tb';
import { persistedStore, store } from 'state';

const PlaylistMenu: React.FC<{ playlists: Playlist[] }> = ({ playlists }) => {
  const handlePlay = (shuffle = false) => {
    playbackActions.playPlaylist(playlists[0], shuffle);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handleAddToQueue = (next = false) => {
    const queueId = persistedStore.queueId.peek();
    if (queueId === 0) {
      playbackActions.playPlaylist(playlists[0]);
    } else {
      queueActions.addToQueue(playlists[0], undefined, undefined, next);
    }
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  return (
    <>
      <MenuItem onClick={() => handlePlay()}>
        <ListItemIcon>
          <BsPlayFill />
        </ListItemIcon>
        <ListItemText>Play now</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handlePlay(true)}>
        <ListItemIcon sx={{ fontSize: '1.2rem' }}>
          <TbArrowsShuffle />
        </ListItemIcon>
        <ListItemText>Shuffle</ListItemText>
      </MenuItem>
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

export default PlaylistMenu;
