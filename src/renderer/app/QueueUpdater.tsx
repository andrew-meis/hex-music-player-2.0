import { useObserve } from '@legendapp/state/react';
import { audio } from 'audio';
import { isEqual } from 'lodash';
import { useQueue } from 'queries';
import React, { useEffect } from 'react';
import { store } from 'state';

const QueueUpdater: React.FC = () => {
  const { data: queue, refetch } = useQueue();

  useEffect(() => {
    if (!queue) return;
    // Set nowPlaying
    const currentIndex = queue.items.findIndex((item) => item.id === queue.selectedItemId);
    store.audio.nowPlaying.set(queue.items[currentIndex]);
    // Set queueSrcs
    store.audio.queueSrcs.set(
      queue.items.slice(currentIndex).map((item) => item.track.getTrackSrc())
    );
    // Set next
    if (queue.items[currentIndex + 1]) {
      store.audio.next.set(queue.items[currentIndex + 1]);
    } else {
      store.audio.next.set(undefined);
    }
    // set previous
    if (queue.items[currentIndex - 1]) {
      store.audio.previous.set(queue.items[currentIndex - 1]);
    } else {
      store.audio.previous.set(undefined);
    }
  }, [queue]);

  useObserve(store.audio.queueSrcs, ({ value }) => {
    if (!value) return;
    if (isEqual(value, audio.tracks())) return;
    audio.updateTracks(...(value as string[]));
  });

  useObserve(store.audio.updateQueue, async ({ value }) => {
    if (!value) return;
    await refetch();
    store.audio.updateQueue.set(false);
  });

  return null;
};

export default QueueUpdater;
