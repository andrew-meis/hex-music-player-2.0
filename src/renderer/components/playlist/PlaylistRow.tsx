import { observer } from '@legendapp/state/react';
import { Avatar, Box, Typography } from '@mui/material';
import { Playlist } from 'api';
import Row from 'components/row/Row';
import React from 'react';
import { Link } from 'react-router-dom';
import { createPlaylistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const PlaylistRow: React.FC<{ index: number; playlist: Playlist }> = observer(function PlaylistRow({
  index,
  playlist,
}) {
  const library = store.library.get();

  const thumbSrc = library.resizeImage({
    url: playlist.thumb || playlist.composite,
    width: 64,
    height: 64,
  });

  const handleLink = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <Row index={index}>
      <Avatar
        alt={playlist.title}
        src={thumbSrc}
        sx={{ height: 48, marginX: 1, width: 48 }}
        variant="rounded"
      />
      <Box>
        <Typography fontFamily="Rubik" lineHeight={1.2} variant="body1">
          <Link
            className="link"
            to={createPlaylistNavigate(playlist)}
            onClick={(event) => handleLink(event)}
          >
            {playlist.title}
          </Link>
        </Typography>
        <Typography variant="subtitle1">
          {playlist.type}
          &nbsp; · &nbsp;
          {playlist.leafCount}
          &nbsp;
          {playlist.leafCount > 1 || playlist.leafCount === 0 ? 'tracks' : 'track'}
        </Typography>
      </Box>
    </Row>
  );
});

export default PlaylistRow;
