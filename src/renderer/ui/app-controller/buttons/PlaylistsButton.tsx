import { reactive } from '@legendapp/state/react';
import { IconButton } from '@mui/material';
import { Album, Artist, PlaylistItem, Track } from 'api';
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { BsMusicNoteList } from 'react-icons/bs';
import { store } from 'state';
import { DragTypes } from 'typescript';

const ReactiveIconButton = reactive(IconButton);

const PlaylistsButton: React.FC = () => {
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [DragTypes.ALBUM, DragTypes.ARTIST, DragTypes.PLAYLIST_ITEM, DragTypes.TRACK],
      drop: (items: (Album | Artist | PlaylistItem | Track)[]) => {
        clearTimeout(timeout.current);
        console.log(items);
      },
      collect: (monitor) => ({ canDrop: monitor.canDrop(), isOver: monitor.isOver() }),
    }),
    []
  );

  const handleButtonClick = () => store.ui.drawers.playlists.open.toggle();

  return (
    <ReactiveIconButton
      $className={() => (store.ui.drawers.playlists.open.get() || isOver ? 'selected' : '')}
      ref={drop}
      sx={{
        outline: canDrop ? '2px solid var(--mui-palette-primary-main)' : '',
      }}
      onClick={handleButtonClick}
      onDragEnter={() => (canDrop ? (timeout.current = setTimeout(handleButtonClick, 500)) : null)}
      onDragLeave={() => clearTimeout(timeout.current)}
    >
      <BsMusicNoteList />
    </ReactiveIconButton>
  );
};

export default PlaylistsButton;
