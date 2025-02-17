import { observer, useObserve } from '@legendapp/state/react';
import { audio } from 'audio';
import { isEqual } from 'lodash';
import { usePlaylists, useQueue } from 'queries';
import React, { useEffect } from 'react';
import { persistedStore, store } from 'state';

const PlaylistsUpdater: React.FC = observer(function PlaylistsUpdater() {
  const query = usePlaylists();

  useEffect(() => {
    const { data: playlists } = query;
    store.playlists.currentPlaylists.set(playlists);
  }, [query]);

  useObserve(store.events.updatePlaylists, async ({ value }) => {
    if (!value || query.status === 'pending') return;
    if (value === true) {
      await query.refetch();
      store.events.updatePlaylists.set(false);
      return;
    }
  });

  return null;
});

const QueueUpdater: React.FC = observer(function QueueUpdater() {
  const center = undefined;
  const queueId = persistedStore.queueId.get();
  const repeat = store.audio.repeat.get() === 'none' ? 0 : 1;

  const query = useQueue(queueId, repeat, center);

  useEffect(() => {
    const { data: queue } = query;
    store.queue.currentQueue.set(queue);
  }, [query]);

  useObserve(store.events.newQueue, ({ value }) => {
    if (!value) return;
    store.audio.isPlaying.set(true);
    store.audio.autoplay.set(true);
    store.events.newQueue.set(false);
  });

  useObserve(store.queue.srcs, ({ value }) => {
    if (!value) return;
    if (isEqual(value, audio.tracks())) return;
    audio.updateTracks(...value);
  });

  useObserve(store.events.updateQueue, async ({ value }) => {
    if (!value || query.status === 'pending') return;
    if (value === true) {
      await query.refetch();
      store.events.updateQueue.set(false);
      return;
    }
    if (value === 'force-playback') {
      await query.refetch();
      store.audio.isPlaying.set(true);
      store.audio.autoplay.set(true);
      store.events.updateQueue.set(false);
    }
  });

  return null;
});

const QueryUpdaters: React.FC = () => {
  return (
    <>
      <PlaylistsUpdater />
      <QueueUpdater />
    </>
  );
};

export default QueryUpdaters;
