import { observer, Show } from '@legendapp/state/react';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useImageResize } from 'hooks/useImageResize';
import React from 'react';
import { HiOutlineHeart } from 'react-icons/hi2';
import { createSearchParams, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { createArtistNavigate, createTrackNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const MotionBox = motion(Box);

const NowPlaying: React.FC = observer(function NowPlaying() {
  const nowPlaying = store.queue.nowPlaying.get();
  const navigate = useNavigate();
  const location = useLocation();

  const thumbSrc = useImageResize(
    new URLSearchParams({
      url: nowPlaying?.track.parentThumb || '',
      width: '100',
      height: '100',
    })
  );

  return (
    <Show
      if={!(location.pathname === '/now-playing' && location.search === '?tab=metadata')}
      wrap={AnimatePresence}
    >
      <MotionBox
        alignItems="center"
        animate={{ opacity: 1 }}
        display="flex"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        width={1}
      >
        <Avatar
          src={thumbSrc}
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
      </MotionBox>
    </Show>
  );
});

export default NowPlaying;
