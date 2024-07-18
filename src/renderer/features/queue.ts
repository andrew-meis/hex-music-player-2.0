import { Album, Artist, Playlist, PlaylistItem, Track } from 'api';
import ky from 'ky';
import { persistedStore, store } from 'state';

const addToQueue = async (
  newItems: (Album | Artist | PlaylistItem | Track)[] | Playlist,
  after = 0,
  end = false,
  next = false
) => {
  const library = store.library.peek();
  let uri: string;
  if (Array.isArray(newItems)) {
    const ids = newItems.map((item) => item.id).join(',');
    uri = library.buildLibraryURI(
      library.server.account.client.identifier,
      `/library/metadata/${ids}`
    );
  } else {
    uri = `${library.device.uri}${newItems.key}`;
  }
  const url = library.server.getAuthenticatedUrl(
    `/playQueues/${persistedStore.queueId.peek()}`,
    new URLSearchParams({
      uri,
      ...(after && { after: after.toString() }),
      ...(end && { end: '1' }),
      ...(next && { next: '1' }),
    })
  );
  await ky.put(url);
  store.events.updateQueue.set(true);
};

const createQueue = async (uri: string, shuffle = false, key: string | undefined = undefined) => {
  const library = store.library.peek();
  const { id } = await library.createQueue({ uri, shuffle, key });
  persistedStore.queueId.set(id);
  store.events.newQueue.set(true);
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
  store.events.updateQueue.set(true);
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
  store.events.updateQueue.set(true);
};

export const queueActions = {
  addToQueue,
  createQueue,
  moveWithinQueue,
  removeFromQueue,
};
