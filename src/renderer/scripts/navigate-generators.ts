import { Album, Artist, Genre, isAlbum, isArtist, Playlist, Track } from 'api';
import { createSearchParams } from 'react-router-dom';

export const createArtistNavigate = (obj: Artist | Album | Track, subroute?: string) => {
  if (isArtist(obj)) {
    return {
      pathname: `/artist/${obj.id}` + (subroute ? `/${subroute}` : ''),
      search: createSearchParams({
        guid: obj.guid,
        title: obj.title,
      }).toString(),
    };
  }
  if (isAlbum(obj)) {
    return {
      pathname: `/artist/${obj.parentId}` + (subroute ? `/${subroute}` : ''),
      search: createSearchParams({
        guid: obj.parentGuid,
        title: obj.parentTitle,
      }).toString(),
    };
  }
  return {
    pathname: `/artist/${obj.grandparentId}` + (subroute ? `/${subroute}` : ''),
    search: createSearchParams({
      guid: obj.grandparentGuid,
      title: obj.grandparentTitle,
    }).toString(),
  };
};

export const createAlbumNavigate = (obj: Album | Track) => {
  if (isAlbum(obj)) {
    return {
      pathname: `/album/${obj.id}`,
    };
  }
  return {
    pathname: `/album/${obj.parentId}`,
  };
};

export const createGenreNavigate = (obj: Genre) => ({
  pathname: `/genre/${obj.id}`,
  search: createSearchParams({
    title: obj.title,
  }).toString(),
});

export const createPlaylistNavigate = (obj: Playlist) => ({
  pathname: `/playlist/${obj.id}`,
});

export const createTrackNavigate = (obj: Track) => ({
  pathname: `/track/${obj.id}`,
  search: createSearchParams({
    artist: obj.grandparentTitle,
    title: obj.title,
  }).toString(),
});
