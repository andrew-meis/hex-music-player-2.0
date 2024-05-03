import { Album, Artist, Playlist, PlayQueueItem, Track } from 'api';
import { audio, queueActions } from 'audio';
import { store } from 'state';
import { v4 } from 'uuid';

const playAlbumRadio = async (album: Album) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  const uri = `${library.device.uri}/library/sections/${sectionId}/stations/3/${album.id}/${v4()}?type=audio&maxDegreesOfSeparation=-1`;
  queueActions.createQueue(uri, false);
};

const playArtistRadio = async (artist: Artist) => {
  const library = store.library.peek();
  const uri = `${library.device.uri}/library/metadata/${artist.id}/station/${v4()}?type=10&maxDegreesOfSeparation=-1`;
  queueActions.createQueue(uri, false);
};

const playLibraryItems = async (
  items: (Album | Artist | Track)[],
  shuffle = false,
  key: string | undefined = undefined
) => {
  const library = store.library.peek();
  const ids = items.map((item) => item.id).join(',');
  const uri = library.buildLibraryURI(
    library.server.account.client.identifier,
    `/library/metadata/${ids}`
  );
  queueActions.createQueue(uri, shuffle, key);
};

const playPlaylist = async (
  playlist: Playlist,
  shuffle = false,
  key: string | undefined = undefined
) => {
  const library = store.library.peek();
  const uri = `${library.device.uri}/playlists/${playlist.id}/items`;
  queueActions.createQueue(uri, shuffle, key);
};

const playQueueItem = async (item: PlayQueueItem) => {
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
    currentTime: 0,
    duration: item.track.duration,
    key: item.track.key,
    playerState: 'playing',
    queueItemId: item.id,
    ratingKey: item.track.ratingKey,
  });
  store.events.updateQueue.set('force-playback');
};

const playTrackRadio = async (track: Track) => {
  const library = store.library.peek();
  const uri = `${library.device.uri}/library/metadata/${track.id}/station/${v4()}?type=10&maxDegreesOfSeparation=-1`;
  queueActions.createQueue(uri, false);
};

export const playbackActions = {
  playAlbumRadio,
  playArtistRadio,
  playLibraryItems,
  playPlaylist,
  playQueueItem,
  playTrackRadio,
};
