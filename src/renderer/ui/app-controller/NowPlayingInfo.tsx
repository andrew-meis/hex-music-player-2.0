import { observer, reactive, Show, useSelector } from '@legendapp/state/react';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { IoChevronDown } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { createArtistNavigate, createTrackNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const MotionBox = motion(Box);
const ReactiveMotionBox = reactive(MotionBox);

const NowPlayingInfo: React.FC = observer(function NowPlayingInfo() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const albumThumbSrc = useSelector(() => {
    return library.resizeImage(
      new URLSearchParams({ url: nowPlaying?.track.parentThumb, width: '100', height: '100' })
    );
  });

  return (
    <>
      <ReactiveMotionBox
        $animate={() => ({
          opacity: store.ui.overlay.get() && store.ui.nowPlaying.activeSection.get() === 1 ? 0 : 1,
          pointerEvents:
            store.ui.overlay.get() && store.ui.nowPlaying.activeSection.get() === 1
              ? 'none'
              : 'auto',
        })}
        display="flex"
      >
        <Avatar
          src={albumThumbSrc}
          sx={{
            boxShadow: 'var(--mui-shadows-2)',
            cursor: 'pointer',
            flexShrink: 0,
            height: 58,
            marginRight: 1,
            pointerEvents: 'auto',
            width: 58,
          }}
          variant="rounded"
          onClick={() => store.ui.overlay.toggle()}
        >
          <SvgIcon>
            <BiSolidAlbum />
          </SvgIcon>
        </Avatar>
        <Box alignItems="center" display="flex">
          {nowPlaying && (
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
          )}
        </Box>
      </ReactiveMotionBox>
      <Show if={store.ui.overlay}>
        <Avatar
          sx={(theme) => ({
            background: 'transparent',
            color: theme.palette.text.secondary,
            position: 'absolute',
            pointerEvents: 'none',
            left: 8,
            height: 58,
            width: 58,
          })}
          variant="rounded"
        >
          <IoChevronDown />
        </Avatar>
      </Show>
    </>
  );
});

export default NowPlayingInfo;
