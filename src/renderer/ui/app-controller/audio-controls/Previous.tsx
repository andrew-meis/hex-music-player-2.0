import { observer } from '@legendapp/state/react';
import { IconButton, SvgIcon } from '@mui/material';
import { audio } from 'audio';
import React from 'react';
import { IoPlaySkipBack } from 'react-icons/io5';
import { persistedStore, store } from 'state';

const Previous: React.FC = observer(function Previous() {
  const handlePrevious = async () => {
    const library = store.library.peek();
    const nowPlaying = store.audio.nowPlaying.peek();
    const previous = store.audio.previous.peek();
    if (!previous) {
      audio.currentTime = 0;
      return;
    }
    if (audio.currentTimeMillis >= 5000) {
      audio.currentTime = 0;
      return;
    }
    window.clearInterval(store.audio.intervalTimer.peek());
    await library.timeline({
      currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
      duration: nowPlaying.track.duration,
      key: nowPlaying.track.key,
      playerState: 'stopped',
      queueItemId: nowPlaying.id,
      ratingKey: nowPlaying.track.ratingKey,
    });
    await library.timeline({
      currentTime: 0,
      duration: previous.track.duration,
      key: previous.track.key,
      playerState: 'playing',
      queueItemId: previous.id,
      ratingKey: previous.track.ratingKey,
    });
    store.audio.updateQueue.set('force-playback');
  };

  return (
    <IconButton
      disabled={persistedStore.queueId.get() === 0}
      sx={{
        cursor: 'default',
        marginRight: 0.25,
        padding: 1,
      }}
      onClick={handlePrevious}
    >
      <SvgIcon sx={{ width: 20, height: 20 }}>
        <IoPlaySkipBack />
      </SvgIcon>
    </IconButton>
  );
});

export default Previous;
