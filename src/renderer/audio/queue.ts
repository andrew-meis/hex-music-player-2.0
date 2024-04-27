import { Track } from 'api';
import ky from 'ky';
import { persistedStore, store } from 'state';

const addToQueue = async (newItems: Track | Track[], after = 0, end = false, next = false) => {
  const library = store.library.peek();
  let uri: string;
  console.log(newItems);
  if (Array.isArray(newItems)) {
    const ids = newItems.map((track) => track.id).join(',');
    uri = library.buildLibraryURI(
      library.server.account.client.identifier,
      `/library/metadata/${ids}`
    );
  } else {
    uri = `${library.device.uri}${newItems.key}`;
  }
  const url = library.server.getAuthenticatedUrl(`/playQueues/${persistedStore.queueid.peek()}`, {
    uri,
    ...(after && { after }),
    ...(end && { end: 1 }),
    ...(next && { next: 1 }),
  });
  await ky.put(url);
  store.audio.updateQueue.set(true);
};

export const queueActions = {
  addToQueue,
};
