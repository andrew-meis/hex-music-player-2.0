import { observer, useObserveEffect } from '@legendapp/state/react';
import { Grid, Slider, Typography } from '@mui/material';
import { audio } from 'audio';
import React, { useRef } from 'react';
import formatTime from 'scripts/format-time';
import { persistedStore, store } from 'state';

const Seekbar: React.FC = observer(function Seekbar() {
  const elapsed = useRef<HTMLSpanElement>(null);
  const remaining = useRef<HTMLSpanElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const nowPlaying = store.audio.nowPlaying.get();

  useObserveEffect(() => {
    const current = store.audio.currentTimeMillis.get();
    const nowPlaying = store.audio.nowPlaying.get();
    if (elapsed.current && remaining.current && !nowPlaying) {
      elapsed.current.innerText = '--:--';
      remaining.current.innerText = '--:--';
    }
    if (!elapsed.current || !remaining.current || !thumb.current || !track.current || !nowPlaying)
      return;
    const displayRemainingTime = persistedStore.displayRemainingTime.get();
    const seekbarDraggingPosition = store.audio.seekbarDraggingPosition.get();
    const { duration } = nowPlaying.track;
    if (seekbarDraggingPosition) {
      elapsed.current.innerText = formatTime(seekbarDraggingPosition);
      remaining.current.innerText = displayRemainingTime
        ? `-${formatTime(duration - seekbarDraggingPosition)}`
        : formatTime(duration);
    }
    if (!seekbarDraggingPosition) {
      elapsed.current.innerText = formatTime(current);
      remaining.current.innerText = displayRemainingTime
        ? `-${formatTime(duration - current)}`
        : formatTime(duration);
    }
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
    <Grid container flexBasis="100%" marginX={1} paddingY={1}>
      <Grid item xs alignItems="center" display="flex" height={30} marginRight={1}>
        <Slider
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
            height: 4,
          }}
          value={0}
          onChange={changePosition}
          onChangeCommitted={commitPosition}
        />
      </Grid>
      <Grid item display="flex" justifyContent="flex-end" width="50px">
        <Typography mr={1} mt="4px" position="absolute" variant="subtitle2">
          <span ref={elapsed} />
        </Typography>
      </Grid>
      <Typography mt="4px" variant="subtitle2">
        /
      </Typography>
      <Grid
        item
        display="flex"
        justifyContent="flex-start"
        width="50px"
        onClick={() => persistedStore.displayRemainingTime.toggle()}
      >
        <Typography ml={1} mt="4px" position="absolute" variant="subtitle2">
          <span ref={remaining} />
        </Typography>
      </Grid>
    </Grid>
  );
});

export default Seekbar;
