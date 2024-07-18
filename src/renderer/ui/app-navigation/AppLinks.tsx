import { reactive } from '@legendapp/state/react';
import { Box, IconButton } from '@mui/material';
import { Album, Artist, PlaylistItem, Track } from 'api';
import { queueActions } from 'features/queue';
import React from 'react';
import { useDrop } from 'react-dnd';
import { BsViewList } from 'react-icons/bs';
import { CgSearch } from 'react-icons/cg';
import { TiChartLine } from 'react-icons/ti';
import { useLocation, useNavigate } from 'react-router-dom';
import { store } from 'state';
import { DragTypes } from 'typescript';

const ReactiveIconButton = reactive(IconButton);

type Buttons = 'search' | 'charts' | 'queue';

const QueueLink: React.FC<{
  handleButtonClick: (buttonClicked: Buttons) => void;
}> = ({ handleButtonClick }) => {
  const location = useLocation();
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [DragTypes.ALBUM, DragTypes.ARTIST, DragTypes.PLAYLIST_ITEM, DragTypes.TRACK],
      drop: (items: (Album | Artist | PlaylistItem | Track)[]) => queueActions.addToQueue(items),
      collect: (monitor) => ({ canDrop: monitor.canDrop(), isOver: monitor.isOver() }),
    }),
    []
  );

  return (
    <ReactiveIconButton
      $className={() =>
        (location.pathname === '/queue' && !store.ui.overlay.get()) || isOver ? 'selected' : ''
      }
      ref={drop}
      sx={{
        fontSize: '1.375rem',
        height: 36,
        width: 36,
        outline: canDrop ? '2px solid var(--mui-palette-primary-main)' : '',
      }}
      onClick={() => handleButtonClick('queue')}
      onDragEnter={() => setTimeout(() => handleButtonClick('queue'), 500)}
    >
      <BsViewList style={{ pointerEvents: 'none' }} viewBox="0 3 16 16" />
      <BsViewList style={{ pointerEvents: 'none', position: 'absolute' }} viewBox="0 -12 16 16" />
    </ReactiveIconButton>
  );
};

const AppLinks: React.FC<{
  locations: React.MutableRefObject<{
    charts: string;
    library: string;
    queue: string;
    search: string;
    settings: string;
  }>;
}> = ({ locations }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleButtonClick = (buttonClicked: Buttons) => {
    switch (buttonClicked) {
      case 'search':
        if (location.pathname === '/search') {
          store.ui.overlay.set(false);
          return;
        }
        navigate(locations.current.search);
        break;
      case 'charts':
        if (location.pathname === '/charts') {
          store.ui.overlay.set(false);
          return;
        }
        navigate(locations.current.charts);
        break;
      case 'queue':
        if (location.pathname === '/queue') {
          store.ui.queue.activeTab.set('0');
          store.ui.overlay.set(false);
          return;
        }
        navigate(locations.current.queue);
        break;
      default:
        break;
    }
  };

  return (
    <Box display="flex" justifySelf="end">
      <ReactiveIconButton
        $className={() =>
          location.pathname === '/search' && !store.ui.overlay.get() ? 'selected' : ''
        }
        onClick={() => handleButtonClick('search')}
      >
        <CgSearch viewBox="1 -1 25 24" />
      </ReactiveIconButton>
      <ReactiveIconButton
        $className={() =>
          location.pathname === '/charts' && !store.ui.overlay.get() ? 'selected' : ''
        }
        onClick={() => handleButtonClick('charts')}
      >
        <TiChartLine />
      </ReactiveIconButton>
      <QueueLink handleButtonClick={handleButtonClick} />
    </Box>
  );
};

export default AppLinks;
