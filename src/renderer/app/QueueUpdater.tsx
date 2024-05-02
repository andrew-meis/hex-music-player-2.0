import { observer, useObserve } from '@legendapp/state/react';
import { audio } from 'audio';
import { isEqual } from 'lodash';
import { useQueue } from 'queries';
import React, { useEffect } from 'react';
import { persistedStore, store } from 'state';

const QueueUpdater: React.FC = observer(function QueueUpdater() {
  const queueId = persistedStore.queueId.get();
  const query = useQueue(queueId);

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

export default QueueUpdater;
