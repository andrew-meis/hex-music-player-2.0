import { observer, useObserve } from '@legendapp/state/react';
import { Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { PlayQueueItem } from 'api';
import { playbackActions, queueActions } from 'audio';
import React, { useRef } from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';
import { TiArrowForward } from 'react-icons/ti';
import { store } from 'state';

const QueueMenu: React.FC = observer(function QueueMenu() {
  const items = store.ui.menus.items.get() as PlayQueueItem[];
  const nowPlayingRef = useRef<PlayQueueItem | undefined>();

  useObserve(store.audio.nowPlaying, ({ value }) => {
    if (!nowPlayingRef.current) {
      nowPlayingRef.current = value;
      return;
    }
    if (value && nowPlayingRef.current.id !== value.id) {
      store.ui.menus.anchorPosition.set(null);
    }
  });

  const handleMoveNext = () => {
    const nowPlaying = store.audio.nowPlaying.peek();
    queueActions.moveWithinQueue(
      items.map((item) => item.id),
      nowPlaying.id
    );
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handlePlayFromHere = () => {
    playbackActions.playQueueItem(items[0]);
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  const handleRemove = () => {
    queueActions.removeFromQueue(items.map((item) => item.id));
    setTimeout(() => store.ui.menus.anchorPosition.set(null), 300);
  };

  return (
    <>
      {items.length === 1 && (
        <MenuItem onClick={handlePlayFromHere}>
          <ListItemIcon>
            <BsPlayFill />
          </ListItemIcon>
          <ListItemText>Play from here</ListItemText>
        </MenuItem>
      )}
      <MenuItem onClick={handleMoveNext}>
        <ListItemIcon>
          <TiArrowForward />
        </ListItemIcon>
        <ListItemText>Move next</ListItemText>
      </MenuItem>
      <Divider sx={{ margin: '4px !important' }} />
      <MenuItem
        sx={{ '&:hover': { background: 'rgba(var(--mui-palette-error-mainChannel) / 0.5)' } }}
        onClick={handleRemove}
      >
        <ListItemIcon>
          <MdClear />
        </ListItemIcon>
        <ListItemText>Remove</ListItemText>
      </MenuItem>
    </>
  );
});

export default QueueMenu;
