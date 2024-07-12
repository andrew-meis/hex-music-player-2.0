import { observer, reactive, Show, useSelector } from '@legendapp/state/react';
import { Avatar, Box, SvgIcon, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { IoChevronDown } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { createArtistNavigate, createTrackNavigate } from 'scripts/navigate-generators';
import { store } from 'state';

const MotionBox = motion(Box);
const ReactiveBox = reactive(Box);
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
          opacity: store.ui.overlay.get() ? 0 : 1,
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
            width: 58,
          }}
          variant="rounded"
          onClick={() => store.ui.overlay.toggle()}
        >
          <SvgIcon>
            <BiSolidAlbum />
          </SvgIcon>
        </Avatar>
        <ReactiveBox
          $sx={() => ({ pointerEvents: store.ui.overlay.get() ? 'none' : 'inherit' })}
          alignItems="center"
          display="flex"
        >
          {nowPlaying && (
            <Box>
              <Typography variant="title1">
                <Link
                  className="link"
                  to={createTrackNavigate(nowPlaying.track)}
                  onClick={(event) => event.stopPropagation()}
                >
                  {nowPlaying.track.title}
                </Link>
              </Typography>
              <Typography variant="title2">
                <Link
                  className="link"
                  to={createArtistNavigate(nowPlaying.track)}
                  onClick={(event) => event.stopPropagation()}
                >
                  {nowPlaying.track.originalTitle
                    ? nowPlaying.track.originalTitle
                    : nowPlaying.track.grandparentTitle}
                </Link>
              </Typography>
            </Box>
          )}
        </ReactiveBox>
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
