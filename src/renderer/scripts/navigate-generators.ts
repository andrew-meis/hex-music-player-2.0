import { Album, Artist, Collection, Genre, isAlbum, isArtist, Playlist, Track } from 'api';
import { createSearchParams } from 'react-router-dom';

export const createArtistNavigate = (obj: Artist | Album | Track, subroute?: string) => {
  if (isArtist(obj)) {
    return {
      pathname: `/artists/${obj.id}` + (subroute ? `/${subroute}` : ''),
      search: createSearchParams({
        guid: obj.guid,
        title: obj.title,
      }).toString(),
    };
  }
  if (isAlbum(obj)) {
    return {
      pathname: `/artists/${obj.parentId}` + (subroute ? `/${subroute}` : ''),
      search: createSearchParams({
        guid: obj.parentGuid,
        title: obj.parentTitle,
      }).toString(),
    };
  }
  return {
    pathname: `/artists/${obj.grandparentId}` + (subroute ? `/${subroute}` : ''),
    search: createSearchParams({
      guid: obj.grandparentGuid,
      title: obj.grandparentTitle,
    }).toString(),
  };
};

export const createAlbumNavigate = (obj: Album | Track) => {
  if (isAlbum(obj)) {
    return {
      pathname: `/albums/${obj.id}`,
      search: createSearchParams({
        guid: obj.guid,
        title: obj.title,
        parentGuid: obj.parentGuid,
        parentId: obj.parentId.toString(),
        parentTitle: obj.parentTitle,
      }).toString(),
    };
  }
  return {
    pathname: `/albums/${obj.parentId}`,
    search: createSearchParams({
      guid: obj.parentGuid,
      title: obj.parentTitle,
      parentGuid: obj.grandparentGuid,
      parentId: obj.grandparentId.toString(),
      parentTitle: obj.grandparentTitle,
    }).toString(),
  };
};

export const createCollectionNavigate = (obj: Collection) => ({
  pathname: `/collections/${obj.id}`,
  search: createSearchParams({
    title: obj.title,
  }).toString(),
});

export const createGenreNavigate = (obj: Genre) => ({
  pathname: `/genres/${obj.id}`,
  search: createSearchParams({
    title: obj.title,
  }).toString(),
});

export const createPlaylistNavigate = (obj: Playlist) => ({
  pathname: `/playlists/${obj.id}`,
  search: createSearchParams({
    title: obj.title,
  }).toString(),
});

export const createTrackNavigate = (obj: Track) => ({
  pathname: `/tracks/${obj.id}`,
  search: createSearchParams({
    title: obj.title,
    parentGuid: obj.parentGuid,
    parentId: obj.parentId.toString(),
    parentTitle: obj.parentTitle,
    grandparentGuid: obj.grandparentGuid,
    grandparentId: obj.grandparentId.toString(),
    grandparentTitle: obj.grandparentTitle,
  }).toString(),
});
