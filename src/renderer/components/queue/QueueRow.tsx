import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, Typography } from '@mui/material';
import { PlayQueueItem } from 'api';
import Row from 'components/row/Row';
import React from 'react';
import { IoMusicalNotes } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import {
  createAlbumNavigate,
  createArtistNavigate,
  createTrackNavigate,
} from 'scripts/navigate-generators';
import { store } from 'state';

const QueueRow: React.FC<{ queueItem: PlayQueueItem }> = observer(function QueueRow({ queueItem }) {
  const { track } = queueItem;
  const library = store.library.get();

  const isSelected = useSelector(() => store.ui.selections.get().includes(queueItem.id));

  const thumbSrc = library.resizeImage({ url: track.thumb, width: 64, height: 64 });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    store.ui.menus.anchorPosition.set({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
    store.ui.menus.items.set([queueItem]);
  };

  const handleLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <>
      <Row
        bgcolor={isSelected ? 'action.selected' : 'transparent'}
        onContextMenu={handleContextMenu}
      >
        <Avatar
          alt={track.title}
          src={thumbSrc}
          sx={{ height: 48, marginX: 1, width: 48 }}
          variant="rounded"
        >
          <IoMusicalNotes />
        </Avatar>
        <Box>
          <Typography fontFamily="Rubik, sans-serif" lineHeight={1.2} variant="body1">
            <Link
              className="link"
              to={createTrackNavigate(track)}
              onClick={(event) => handleLink(event)}
            >
              {track.title}
            </Link>
          </Typography>
          <Typography variant="subtitle2">
            <Link
              className="link"
              to={createArtistNavigate(track)}
              onClick={(event) => handleLink(event)}
            >
              {track.originalTitle ? track.originalTitle : track.grandparentTitle}
            </Link>
            &nbsp; — &nbsp;
            <Link
              className="link"
              to={createAlbumNavigate(track)}
              onClick={(event) => handleLink(event)}
            >
              {track.parentTitle}
            </Link>
          </Typography>
        </Box>
      </Row>
    </>
  );
});

export default QueueRow;
