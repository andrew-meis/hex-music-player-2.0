import { Track } from 'api';
import ky from 'ky';
import { persistedStore, store } from 'state';

const addToQueue = async (newItems: Track[], after = 0, end = false, next = false) => {
  const library = store.library.peek();
  const ids = newItems.map((track) => track.id).join(',');
  const uri = library.buildLibraryURI(
    library.server.account.client.identifier,
    `/library/metadata/${ids}`
  );
  const url = library.server.getAuthenticatedUrl(`/playQueues/${persistedStore.queueId.peek()}`, {
    uri,
    ...(after && { after }),
    ...(end && { end: 1 }),
    ...(next && { next: 1 }),
  });
  await ky.put(url);
  store.audio.updateQueue.set(true);
};

const moveWithinQueue = async (ids: number[], afterId: number) => {
  const library = store.library.peek();
  const queueId = persistedStore.queueId.peek();
  for (const [index, id] of ids.entries()) {
    if (index === 0) {
      await library.movePlayQueueItem(queueId, id, afterId);
    }
    if (index > 0) {
      await library.movePlayQueueItem(queueId, id, ids[index - 1]);
    }
  }
  store.audio.updateQueue.set(true);
};

const removeFromQueue = async (ids: number[]) => {
  const library = store.library.peek();
  const promises = ids.map((id) => {
    const url = library.server.getAuthenticatedUrl(
      `/playQueues/${persistedStore.queueId.peek()}/items/${id}`
    );
    return ky.delete(url);
  });
  await Promise.all(promises);
  store.audio.updateQueue.set(true);
};

export const queueActions = {
  addToQueue,
  moveWithinQueue,
  removeFromQueue,
};
