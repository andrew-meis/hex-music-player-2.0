import { observer, useSelector } from '@legendapp/state/react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import { HiOutlineHeart } from 'react-icons/hi2';
import { createSearchParams, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { createArtistNavigate, createTrackNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const NowPlaying: React.FC = observer(function NowPlaying() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const navigate = useNavigate();
  const location = useLocation();

  const albumThumbSrc = useSelector(() => {
    return library.resizeImage(
      new URLSearchParams({ url: nowPlaying?.track.parentThumb, width: '100', height: '100' })
    );
  });

  return (
    <Box alignItems="center" display="flex" width={1}>
      <Avatar
        src={albumThumbSrc}
        sx={{
          cursor: 'pointer',
          height: 60,
          marginRight: 1,
          pointerEvents: location.pathname === '/now-playing' ? 'none' : '',
          width: 60,
        }}
        variant="rounded"
        onClick={() =>
          navigate({
            pathname: '/now-playing',
            search: createSearchParams({ tab: 'metadata' }).toString(),
          })
        }
      />
      <Box>
        <Typography variant="title1">
          <NavLink
            className="link"
            style={({ isActive }) => (isActive ? { pointerEvents: 'none' } : {})}
            to={createTrackNavigate(nowPlaying.track)}
            onClick={(event) => event.stopPropagation()}
          >
            {nowPlaying.track.title}
          </NavLink>
        </Typography>
        <Typography variant="title2">
          <NavLink
            className="link"
            style={({ isActive }) => (isActive ? { pointerEvents: 'none' } : {})}
            to={createArtistNavigate(nowPlaying.track)}
            onClick={(event) => event.stopPropagation()}
          >
            {nowPlaying.track.originalTitle || nowPlaying.track.grandparentTitle}
          </NavLink>
        </Typography>
      </Box>
      <IconButton sx={{ marginLeft: 'auto' }}>
        <HiOutlineHeart />
      </IconButton>
    </Box>
  );
});

export default NowPlaying;
