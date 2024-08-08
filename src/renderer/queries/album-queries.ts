import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import { Library, SORT_ALBUMS_BY_RELEASE_DATE } from 'api';
import { deburr } from 'lodash';
import paramsToObject from 'scripts/params-to-object';
import { persistedStore, store } from 'state';
import { QueryKeys } from 'typescript';

export const albumsArtistAppearsOnQuery = (
  artistGuid: string,
  artistId: number,
  artistTitle: string,
  useAppearsOnFilters: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.ALBUMS_ARTIST_APPEARS_ON, artistId, useAppearsOnFilters],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      let searchTerms: string | undefined = undefined;
      if (artistTitle !== deburr(artistTitle)) {
        const searchTitle = artistTitle.replace(/[^\w ]/, ' ');
        searchTerms = searchTitle
          .split(' ')
          .filter((value) => value.length > 2)
          .filter((value) => value.toLowerCase() !== 'the')
          .join(',');
      }
      const { tracks } = await library.tracks(
        sectionId,
        new URLSearchParams({
          'artist.id!': artistId.toString(),
          'track.title': searchTerms || artistTitle,
        })
      );
      const albumIds: number[] = [];
      const artistHasFilters = persistedStore.appearsOnFilters[artistGuid].peek();
      if (!artistHasFilters || !useAppearsOnFilters) {
        tracks.forEach((track) => {
          if (track.originalTitle?.toLowerCase().includes(artistTitle.toLowerCase())) {
            albumIds.push(track.parentId);
          }
        });
      }
      if (artistHasFilters && useAppearsOnFilters) {
        tracks.forEach((track) => {
          if (artistHasFilters.exclusions.includes(track.guid)) return;
          if (track.originalTitle?.toLowerCase().includes(artistTitle.toLowerCase())) {
            albumIds.push(track.parentId);
          }
        });
      }
      const { albums } = await library.albums(
        sectionId,
        new URLSearchParams({
          'album.id': albumIds.join(','),
          sort: SORT_ALBUMS_BY_RELEASE_DATE.desc,
        })
      );
      albums.forEach(
        (album) => (album.tracks = tracks.filter((track) => track.parentId === album.id))
      );
      return albums;
    },
    placeholderData: keepPreviousData,
  });

/**
 * Get albums where a given artist makes a guest appearance on a track.
 * @param {string} artistGuid
 * @param {number} artistId
 * @param {string} artistTitle
 * @param {boolean} useAppearsOnFilters
 */
export const useAlbumsArtistAppearsOn = (
  artistGuid: string,
  artistId: number,
  artistTitle: string,
  useAppearsOnFilters: boolean = true
) => {
  return useQuery(
    albumsArtistAppearsOnQuery(artistGuid, artistId, artistTitle, useAppearsOnFilters)
  );
};

export const albumQuery = (id: number) => ({
  queryKey: [QueryKeys.ALBUMS, id],
  queryFn: async () => {
    const library = store.library.peek();
    const response = await library.album(id);
    return response.albums[0];
  },
  placeholderData: keepPreviousData,
});

export const useAlbum = (id: number) => useQuery(albumQuery(id));

export const albumsQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.ALBUMS, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.albums(sectionId, searchParams),
});

export const useAlbums = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(albumsQuery(sectionId, library, searchParams));
};
