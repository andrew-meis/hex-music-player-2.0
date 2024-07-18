import { Memo, useObserve } from '@legendapp/state/react';
import { Box, IconButton, Slider, sliderClasses, styled, SvgIcon, Tooltip } from '@mui/material';
import { audio } from 'audio';
import React, { useState } from 'react';
import { RiVolumeDownFill, RiVolumeMuteFill, RiVolumeUpFill } from 'react-icons/ri';
import { persistedStore, store } from 'state';

const getViewbox = (volume: number) => {
  if (volume === 0) return '0 0 24 24';
  if (volume !== 0 && volume <= 60) return '3 0 24 24';
  return '0 0 24 24';
};

const StyledSlider = styled(Slider)(({ theme }) => {
  return {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
    },
    [`& .${sliderClasses.rail}`]: {
      '&:hover': {
        color: 'inherit',
      },
    },
    [`& .${sliderClasses.thumb}`]: {
      borderRadius: 4,
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

const Volume = () => {
  const [prevVolume, setPrevVolume] = useState(0);

  useObserve(() => {
    const nowPlaying = store.queue.nowPlaying.get();
    const volume = persistedStore.audio.volume.get();
    if (nowPlaying?.track.media[0].parts[0].streams[0].gain) {
      const decibelLevel = 20 * Math.log10(volume / 100);
      const adjustedDecibels = decibelLevel + +nowPlaying.track.media[0].parts[0].streams[0].gain;
      const gainLevel = 10 ** (adjustedDecibels / 20);
      audio.volume = gainLevel;
      return;
    }
    audio.volume = persistedStore.audio.volume.get() / 150;
  });

  const handleVolumeChange = (_event: Event, newVolume: number | number[]) => {
    persistedStore.audio.volume.set(newVolume as number);
  };

  const handleVolumeWheel = (event: React.WheelEvent<HTMLInputElement>) => {
    const volume = persistedStore.audio.volume.get();
    if (event.deltaY > 0) {
      const newVolume = volume - 5;
      if (newVolume <= 0) {
        persistedStore.audio.volume.set(0);
        return;
      }
      persistedStore.audio.volume.set(newVolume);
    }
    if (event.deltaY < 0) {
      const newVolume = volume + 5;
      if (newVolume >= 100) {
        persistedStore.audio.volume.set(100);
        return;
      }
      persistedStore.audio.volume.set(newVolume);
    }
  };

  const handleVolumeClick = () => {
    const volume = persistedStore.audio.volume.get();
    if (volume === 0) {
      persistedStore.audio.volume.set(prevVolume);
      return;
    }
    if (volume > 0) {
      setPrevVolume(persistedStore.audio.volume.get());
      persistedStore.audio.volume.set(0);
    }
  };

  return (
    <Tooltip
      arrow
      leaveDelay={500}
      placement="top"
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -8],
              },
            },
          ],
        },
      }}
      title={
        <Box alignItems="center" display="flex" height={124}>
          <Memo>
            {() => (
              <StyledSlider
                orientation="vertical"
                shiftStep={5}
                sx={{
                  width: 4,
                  height: 100,
                }}
                value={persistedStore.audio.volume.get()}
                onChange={handleVolumeChange}
                onWheel={handleVolumeWheel}
              />
            )}
          </Memo>
        </Box>
      }
    >
      <IconButton sx={{ width: 58 }} onClick={handleVolumeClick}>
        <Memo>
          {() => {
            const volume = persistedStore.audio.volume.get();
            return (
              <SvgIcon viewBox={getViewbox(volume)}>
                {volume === 0 && <RiVolumeMuteFill />}
                {volume !== 0 && volume <= 60 && <RiVolumeDownFill />}
                {volume > 60 && <RiVolumeUpFill />}
              </SvgIcon>
            );
          }}
        </Memo>
      </IconButton>
    </Tooltip>
  );
};

export default Volume;
