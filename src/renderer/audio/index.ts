import PreciseAudio from '@synesthesia-project/precise-audio';
import { store } from 'state';

export { queueActions } from './queue';

export const audio = new PreciseAudio();

window.audio = audio;

audio.thresholds.decodeThresholdSeconds = 360;
audio.thresholds.downloadThresholdSeconds = 360;

audio.addEventListener('timeupdate', () =>
  store.audio.currentTimeMillis.set(audio.currentTimeMillis)
);

audio.addEventListener('canplaythrough', () => {
  if (store.audio.autoplay.peek()) {
    audio.play();
    store.audio.autoplay.set(false);
  }
});

audio.addEventListener('error', (error) => console.log(error));

audio.addEventListener('next', async () => {
  window.clearInterval(store.audio.intervalTimer.peek());
  const next = store.audio.next.peek();
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
  store.audio.nowPlaying.set(next);
  await library.timeline({
    currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
    duration: next.track.duration,
    key: next.track.key,
    playerState: 'playing',
    queueItemId: next.id,
    ratingKey: next.track.ratingKey,
  });
  const intervalTimer = window.setInterval(() => {
    library.timeline({
      currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
      duration: next.track.duration,
      key: next.track.key,
      playerState: 'playing',
      queueItemId: next.id,
      ratingKey: next.track.ratingKey,
    });
  }, 10000);
  store.audio.intervalTimer.set(intervalTimer);
  store.audio.updateQueue.set(true);
});

audio.addEventListener('pause', async () => {
  window.clearInterval(store.audio.intervalTimer.peek());
  const nowPlaying = store.audio.nowPlaying.peek();
  store.audio.isPlaying.set(false);
  const library = store.library.peek();
  await library.timeline({
    currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
    duration: nowPlaying.track.duration,
    key: nowPlaying.track.key,
    playerState: 'paused',
    queueItemId: nowPlaying.id,
    ratingKey: nowPlaying.track.ratingKey,
  });
});

audio.addEventListener('play', async () => {
  window.clearInterval(store.audio.intervalTimer.peek());
  const nowPlaying = store.audio.nowPlaying.peek();
  console.log(`$ play event: ${nowPlaying.track.title}`);
  store.audio.isPlaying.set(true);
  const library = store.library.peek();
  await library.timeline({
    currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
    duration: nowPlaying.track.duration,
    key: nowPlaying.track.key,
    playerState: 'playing',
    queueItemId: nowPlaying.id,
    ratingKey: nowPlaying.track.ratingKey,
  });
  const intervalTimer = window.setInterval(() => {
    library.timeline({
      currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
      duration: nowPlaying.track.duration,
      key: nowPlaying.track.key,
      playerState: 'playing',
      queueItemId: nowPlaying.id,
      ratingKey: nowPlaying.track.ratingKey,
    });
  }, 10000);
  store.audio.intervalTimer.set(intervalTimer);
});

audio.addEventListener('seeked', async () => {
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
    currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
    duration: nowPlaying.track.duration,
    key: nowPlaying.track.key,
    playerState: store.audio.isPlaying.peek() ? 'playing' : 'paused',
    queueItemId: nowPlaying.id,
    ratingKey: nowPlaying.track.ratingKey,
  });
  if (store.audio.isPlaying.peek()) {
    const intervalTimer = window.setInterval(() => {
      library.timeline({
        currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
        duration: nowPlaying.track.duration,
        key: nowPlaying.track.key,
        playerState: 'playing',
        queueItemId: nowPlaying.id,
        ratingKey: nowPlaying.track.ratingKey,
      });
    }, 10000);
    store.audio.intervalTimer.set(intervalTimer);
  }
});

audio.addEventListener('volumechange', () => console.log(audio.volume));
