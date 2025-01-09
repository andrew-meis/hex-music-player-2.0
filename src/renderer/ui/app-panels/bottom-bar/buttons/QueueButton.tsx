import { reactive } from '@legendapp/state/react';
import { IconButton } from '@mui/material';
import { Album, Artist, PlaylistItem, Track } from 'api';
import { queueActions } from 'features/queue';
import React from 'react';
import { useDrop } from 'react-dnd';
import { BsViewList } from 'react-icons/bs';
import { store } from 'state';
import { DragTypes } from 'typescript';

const ReactiveIconButton = reactive(IconButton);

const QueueButton: React.FC = () => {
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [DragTypes.ALBUM, DragTypes.ARTIST, DragTypes.PLAYLIST_ITEM, DragTypes.TRACK],
      drop: (items: (Album | Artist | PlaylistItem | Track)[]) => queueActions.addToQueue(items),
      collect: (monitor) => ({ canDrop: monitor.canDrop(), isOver: monitor.isOver() }),
    }),
    []
  );

  const handleButtonClick = () => store.ui.drawers.queue.open.toggle();

  return (
    <ReactiveIconButton
      $className={() => (store.ui.drawers.queue.open.get() || isOver ? 'selected' : '')}
      ref={drop}
      sx={{
        fontSize: '1.375rem',
        height: 36,
        width: 36,
        outline: canDrop ? '2px solid var(--mui-palette-primary-main)' : '',
      }}
      onClick={handleButtonClick}
      onDragEnter={() => setTimeout(handleButtonClick, 500)}
    >
      <BsViewList style={{ pointerEvents: 'none' }} viewBox="0 3 16 16" />
      <BsViewList style={{ pointerEvents: 'none', position: 'absolute' }} viewBox="0 -12 16 16" />
    </ReactiveIconButton>
  );
};

export default QueueButton;
