import { observer, Show } from '@legendapp/state/react';
import { IconButton, SvgIcon } from '@mui/material';
import { audio } from 'audio';
import React from 'react';
import { FaCirclePause, FaCirclePlay } from 'react-icons/fa6';
import { store } from 'state';

const PlayPause: React.FC = observer(function PlayPause() {
  const nowPlaying = store.audio.nowPlaying.get();

  const handlePlayPause = () => {
    if (!nowPlaying) return;
    const isPlaying = store.audio.isPlaying.get();
    if (isPlaying) {
      audio.pause();
      return;
    }
    audio.play();
  };

  return (
    <IconButton
      disabled={!nowPlaying}
      sx={{
        cursor: 'default',
        padding: 0,
        ':active': { transform: 'scale(0.93)' },
      }}
      onClick={handlePlayPause}
    >
      <SvgIcon sx={{ width: 36, height: 36 }}>
        <Show else={<FaCirclePlay />} if={store.audio.isPlaying.get()}>
          <FaCirclePause />
        </Show>
      </SvgIcon>
    </IconButton>
  );
});

export default PlayPause;
