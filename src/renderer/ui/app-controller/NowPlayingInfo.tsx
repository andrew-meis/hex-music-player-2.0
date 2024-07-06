import { observer, reactive, Show, useSelector } from '@legendapp/state/react';
import { Avatar, SvgIcon } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { BiSolidAlbum } from 'react-icons/bi';
import { IoChevronDown } from 'react-icons/io5';
import { store } from 'state';

const MotionAvatar = motion(Avatar);
const ReactiveMotionAvatar = reactive(MotionAvatar);

const NowPlayingInfo: React.FC = observer(function ToggleOverlay() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const albumThumbSrc = useSelector(() => {
    return library.resizeImage(
      new URLSearchParams({ url: nowPlaying?.track.parentThumb, width: '100', height: '100' })
    );
  });

  return (
    <>
      <ReactiveMotionAvatar
        $animate={() => ({
          opacity: store.ui.overlay.get() ? 0 : 1,
        })}
        src={albumThumbSrc}
        sx={{
          boxShadow: 'var(--mui-shadows-2)',
          cursor: 'pointer',
          flexShrink: 0,
          height: 58,
          width: 58,
        }}
        variant="rounded"
        onClick={() => store.ui.overlay.toggle()}
      >
        <SvgIcon>
          <BiSolidAlbum />
        </SvgIcon>
      </ReactiveMotionAvatar>
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
