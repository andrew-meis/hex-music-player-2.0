import { Memo, observer, Show } from '@legendapp/state/react';
import { Grid, Slider, Typography } from '@mui/material';
import { audio } from 'audio';
import React from 'react';
import formatTime from 'scripts/format-time';
import { persistedStore, store } from 'state';

const Seekbar: React.FC = observer(function Seekbar() {
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
        <Memo>
          {() => {
            const nowPlaying = store.audio.nowPlaying.get();
            const currentTimeMillis = store.audio.currentTimeMillis.get();
            const seekbarDraggingPosition = store.audio.seekbarDraggingPosition.get();
            return (
              <Slider
                disabled={!nowPlaying}
                max={nowPlaying?.track.duration || 0}
                min={0}
                sx={{
                  height: 4,
                }}
                value={seekbarDraggingPosition || currentTimeMillis}
                onChange={changePosition}
                onChangeCommitted={commitPosition}
              />
            );
          }}
        </Memo>
      </Grid>
      <Grid item display="flex" justifyContent="flex-end" width="50px">
        <Typography mr={1} mt="4px" position="absolute" variant="subtitle2">
          <Memo>
            {() => {
              const nowPlaying = store.audio.nowPlaying.get();
              const currentTimeMillis = store.audio.currentTimeMillis.get();
              const seekbarDraggingPosition = store.audio.seekbarDraggingPosition.get();
              return (
                <>
                  {!nowPlaying ? '--:--' : formatTime(seekbarDraggingPosition || currentTimeMillis)}
                </>
              );
            }}
          </Memo>
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
          <Show if={persistedStore.displayRemainingTime.get()}>
            <Memo>
              {() => {
                const nowPlaying = store.audio.nowPlaying.get();
                const currentTimeMillis = store.audio.currentTimeMillis.get();
                const seekbarDraggingPosition = store.audio.seekbarDraggingPosition.get();
                return (
                  <>
                    {!nowPlaying
                      ? '--:--'
                      : `-${formatTime(nowPlaying.track.duration - (seekbarDraggingPosition || currentTimeMillis))}`}
                  </>
                );
              }}
            </Memo>
          </Show>
          <Show if={!persistedStore.displayRemainingTime.get()}>
            <Memo>
              {() => {
                const nowPlaying = store.audio.nowPlaying.get();
                return <>{!nowPlaying ? '--:--' : formatTime(nowPlaying.track.duration)}</>;
              }}
            </Memo>
          </Show>
        </Typography>
      </Grid>
    </Grid>
  );
});

export default Seekbar;
