import { Avatar, Box, Typography } from '@mui/joy';
import { Playlist } from 'api';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlaylistNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

import Result from './Result';

const PlaylistResult: React.FC<{ playlist: Playlist }> = ({ playlist }) => {
  const library = store.library.get();
  const navigate = useNavigate();

  const thumbSrc = library.resizeImage({
    url: playlist.thumb || playlist.composite,
    width: 64,
    height: 64,
  });

  const handleNavigate = () => {
    navigate(createPlaylistNavigate(playlist));
  };

  return (
    <Result onClick={handleNavigate}>
      <Avatar
        alt={playlist.title}
        src={thumbSrc}
        sx={{ borderRadius: 4, height: 48, marginX: 1, width: 48 }}
      />
      <Box>
        <Typography fontFamily="Rubik" level="title-md" lineHeight={1.2}>
          {playlist.title}
        </Typography>
        <Typography level="title-sm">
          {playlist.type}
          &nbsp; · &nbsp;
          {playlist.leafCount}
          &nbsp;
          {playlist.leafCount > 1 || playlist.leafCount === 0 ? 'tracks' : 'track'}
        </Typography>
      </Box>
    </Result>
  );
};

export default PlaylistResult;
