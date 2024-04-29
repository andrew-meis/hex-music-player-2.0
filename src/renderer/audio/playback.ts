import { PlayQueueItem } from 'api';
import { audio } from 'audio';
import { store } from 'state';

const playQueueItem = async (item: PlayQueueItem) => {
  window.clearInterval(store.audio.intervalTimer.peek());
  const nowPlaying = store.audio.nowPlaying.peek();
  const library = store.library.peek();
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
    duration: item.track.duration,
    key: item.track.key,
    playerState: 'playing',
    queueItemId: item.id,
    ratingKey: item.track.ratingKey,
  });
  store.audio.updateQueue.set('force-playback');
};

export const playbackActions = {
  playQueueItem,
};
