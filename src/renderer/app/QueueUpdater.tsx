import { useObserve } from '@legendapp/state/react';
import { audio } from 'audio';
import { useQueue } from 'queries';
import React, { useEffect } from 'react';
import { store } from 'state';

const QueueUpdater: React.FC = () => {
  const { data: queue, refetch } = useQueue();

  useEffect(() => {
    const library = store.library.peek();
    if (!queue) return;
    // Set nowPlaying
    const currentIndex = queue.items.findIndex((item) => item.id === queue.selectedItemId);
    store.audio.nowPlaying.set(queue.items[currentIndex]);
    // Set queueSrcs
    store.audio.queueSrcs.set(
      queue.items.slice(currentIndex).map((item) => library.trackSrc(item.track))
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
