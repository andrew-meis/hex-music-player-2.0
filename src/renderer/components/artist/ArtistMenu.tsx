import { observer } from '@legendapp/state/react';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Artist } from 'api';
import { playbackActions, queueActions } from 'audio';
import React from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { CgRowFirst, CgRowLast } from 'react-icons/cg';
import { FiRadio } from 'react-icons/fi';
import { RiShuffleFill } from 'react-icons/ri';
import { persistedStore, store } from 'state';

const ArtistMenu: React.FC = observer(function ArtistMenu() {
  const artists = store.ui.select.selectedItems.get() as Artist[];

  const handlePlay = (shuffle = false) => {
    playbackActions.playLibraryItems(artists, shuffle);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handlePlayRadio = () => {
    playbackActions.playArtistRadio(artists[0]);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handleAddToQueue = (next = false) => {
    const queueId = persistedStore.queueId.peek();
    if (queueId === 0) {
      playbackActions.playLibraryItems(artists);
    } else {
      queueActions.addToQueue(artists, undefined, undefined, next);
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
        <ListItemIcon sx={{ fontSize: '1.15rem' }}>
          <RiShuffleFill />
        </ListItemIcon>
        <ListItemText>Shuffle</ListItemText>
      </MenuItem>
      {artists.length === 1 && (
        <MenuItem onClick={handlePlayRadio}>
          <ListItemIcon sx={{ fontSize: '1.15rem' }}>
            <FiRadio viewBox="0 -1 24 24" />
          </ListItemIcon>
          <ListItemText>Play artist radio</ListItemText>
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
});

export default ArtistMenu;
