import { observer, useObserveEffect } from '@legendapp/state/react';
import { Slider, sliderClasses, styled } from '@mui/material';
import { audio } from 'audio';
import React, { useRef } from 'react';
import { store } from 'state';

const StyledSlider = styled(Slider)(({ theme }) => {
  return {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
    [`& .${sliderClasses.rail}`]: {
      '&:hover': {
        color: 'inherit',
      },
    },
    [`& .${sliderClasses.thumb}`]: {
      height: 8,
      width: 8,
      borderRadius: 2,
      boxShadow: theme.shadows[1],
      color: theme.palette.common.white,
      '&:hover': {
        boxShadow: theme.shadows[3],
        color: theme.palette.common.white,
      },
    },
    [`& .${sliderClasses.track}`]: {
      '&:hover': {
        color: 'inherit',
      },
    },
  };
});

const Seekbar: React.FC = observer(function Seekbar() {
  const thumb = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const nowPlaying = store.queue.nowPlaying.get();

  useObserveEffect(() => {
    const current = store.audio.currentTimeMillis.get();
    const nowPlaying = store.queue.nowPlaying.get();
    if (track.current && !nowPlaying) {
      track.current.style.width = '0%';
    }
    if (!thumb.current || !track.current || !nowPlaying) return;
    const seekbarDraggingPosition = store.audio.seekbarDraggingPosition.get();
    const { duration } = nowPlaying.track;
    thumb.current.style.left = `
      ${((seekbarDraggingPosition || current) / duration) * 100}%
    `;
    track.current.style.width = `
      ${((seekbarDraggingPosition || current) / duration) * 100}%
    `;
  });

  const changePosition = (_event: Event, newValue: number | number[]) => {
    store.audio.seekbarDraggingPosition.set(newValue as number);
  };

  const commitPosition = async (
    _event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    store.audio.seekbarDraggingPosition.set(undefined);
    audio.currentTime = (newValue as number) / 1000;
  };

  return (
    <StyledSlider
      disabled={!nowPlaying}
      max={nowPlaying?.track.duration || 0}
      min={0}
      slotProps={{
        thumb: {
          ref: thumb,
        },
        track: {
          ref: track,
        },
      }}
      sx={{
        borderRadius: 0,
        top: -4,
        height: 2,
        marginX: 1,
        padding: '4px 0',
        position: 'absolute',
        width: 'calc(100% - 16px)',
      }}
      value={0}
      onChange={changePosition}
      onChangeCommitted={commitPosition}
    />
  );
});

export default Seekbar;
