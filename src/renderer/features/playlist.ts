import { store } from 'state';

const addToPlaylist = async (playlistId: number, ids: number[], quiet = false) => {
  const library = store.library.peek();
  const response = await library.addToPlaylist(
    playlistId,
    `${library.device.uri}/library/metadata/${ids.join(',')}`
  );
  if (response.leafCountAdded === response.leafCountRequested) {
    if (quiet) return;
    store.ui.toasts.set((prev) => [
      ...prev,
      { message: 'Added to playlist', key: new Date().getTime() },
    ]);
  }
};

const removeFromPlaylist = async (playlistId: number, ids: number[]) => {
  const library = store.library.peek();
  const promises = ids.map((id) => library.removeFromPlaylist(playlistId, id));
  await Promise.all(promises);
  store.ui.toasts.set((prev) => [
    ...prev,
    { message: 'Removed from playlist', key: new Date().getTime() },
  ]);
};

export const playlistActions = {
  addToPlaylist,
  removeFromPlaylist,
};
