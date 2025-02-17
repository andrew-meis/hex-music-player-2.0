import PreciseAudio from '@synesthesia-project/precise-audio';
import { persistedStore, store } from 'state';

export const audio = new PreciseAudio();

audio.thresholds.decodeThresholdSeconds = 360;
audio.thresholds.downloadThresholdSeconds = 360;

audio.addEventListener('timeupdate', () => {
  const repeat = store.audio.repeat.peek();
  if (repeat === 'one') {
    const remainingMillis = audio.durationMillis - audio.currentTimeMillis;
    if (remainingMillis < 100) audio.currentTime = 0;
  }
  store.audio.currentTimeMillis.set(audio.currentTimeMillis);
});

audio.addEventListener('canplaythrough', () => {
  if (store.audio.autoplay.peek()) {
    audio.play();
    store.audio.autoplay.set(false);
  }
});

audio.addEventListener('ended', async () => {
  window.clearInterval(store.audio.intervalTimer.peek());
  const library = store.library.peek();
  const nowPlaying = store.queue.nowPlaying.peek();
  await library.timeline({
    currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
    duration: nowPlaying.track.duration,
    key: nowPlaying.track.key,
    playerState: 'stopped',
    queueItemId: nowPlaying.id,
    ratingKey: nowPlaying.track.ratingKey,
  });
  store.audio.isPlaying.set(false);
  persistedStore.queueId.set(0);
});

audio.addEventListener('error', (error) => console.log(error));

audio.addEventListener('loadeddata', () => {
  const savedTimeMillis = persistedStore.audio.savedTimeMillis.get();
  if (savedTimeMillis > 0 && audio.durationMillis > savedTimeMillis) {
    audio.currentTime = savedTimeMillis / 1000;
    persistedStore.audio.savedTimeMillis.set(0);
  }
});

audio.addEventListener('next', async () => {
  window.clearInterval(store.audio.intervalTimer.peek());
  const next = store.queue.next.peek();
  const nowPlaying = store.queue.nowPlaying.peek();
  const library = store.library.peek();
  await library.timeline({
    currentTime: Math.max(0, Math.floor(audio.currentTime) * 1000),
    duration: nowPlaying.track.duration,
    key: nowPlaying.track.key,
    playerState: 'stopped',
    queueItemId: nowPlaying.id,
    ratingKey: nowPlaying.track.ratingKey,
  });
  if (!next) return;
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
  const trackState = audio.trackStates().find((value) => value.src === next.track.getTrackSrc());
  if (trackState && trackState.state === 'ready' && store.audio.autoplay.peek()) {
    audio.play();
    store.audio.autoplay.set(false);
  }
  store.audio.intervalTimer.set(intervalTimer);
  store.events.updateQueue.set(true);
});

audio.addEventListener('pause', async () => {
  window.clearInterval(store.audio.intervalTimer.peek());
  const nowPlaying = store.queue.nowPlaying.peek();
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
  const nowPlaying = store.queue.nowPlaying.peek();
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
  const nowPlaying = store.queue.nowPlaying.peek();
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
