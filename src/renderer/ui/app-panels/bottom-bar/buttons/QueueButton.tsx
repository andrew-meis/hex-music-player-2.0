import { reactive } from '@legendapp/state/react';
import { IconButton } from '@mui/material';
import { Album, Artist, PlaylistItem, Track } from 'api';
import { queueActions } from 'features/queue';
import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { BsViewList } from 'react-icons/bs';
import { store } from 'state';
import { DragTypes } from 'typescript';

const ReactiveIconButton = reactive(IconButton);

const QueueButton: React.FC = () => {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [DragTypes.ALBUM, DragTypes.ARTIST, DragTypes.PLAYLIST_ITEM, DragTypes.TRACK],
      drop: (items: (Album | Artist | PlaylistItem | Track)[]) => {
        clearTimeout(timeout.current);
        queueActions.addToQueue(items);
      },
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
        outline: canDrop ? '2px solid var(--mui-palette-primary-main)' : '',
      }}
      onClick={handleButtonClick}
      onDragEnter={() => (timeout.current = setTimeout(handleButtonClick, 500))}
      onDragLeave={() => clearTimeout(timeout.current)}
    >
      <BsViewList style={{ pointerEvents: 'none' }} viewBox="0 3 16 16" />
      <BsViewList style={{ pointerEvents: 'none', position: 'absolute' }} viewBox="0 -12 16 16" />
    </ReactiveIconButton>
  );
};

export default QueueButton;
