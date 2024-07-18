import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import { Library, SORT_ALBUMS_BY_RELEASE_DATE } from 'api';
import { deburr } from 'lodash';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const albumsArtistAppearsOn = (
  id: number,
  guid: string,
  library: Library,
  sectionId: number,
  title: string
) =>
  queryOptions({
    queryKey: [QueryKeys.ALBUMS_ARTIST_APPEARS_ON, id],
    queryFn: async () => {
      let searchTerms: string | undefined = undefined;
      if (title !== deburr(title)) {
        const searchTitle = title.replace(/[^\w ]/, ' ');
        searchTerms = searchTitle
          .split(' ')
          .filter((value) => value.length > 2)
          .filter((value) => value.toLowerCase() !== 'the')
          .join(',');
      }
      const { tracks } = await library.tracks(
        sectionId,
        new URLSearchParams({
          'artist.id!': id.toString(),
          'track.title': searchTerms || title,
        })
      );
      const albumIds: number[] = [];
      tracks.forEach((track) => {
        if (track.originalTitle?.toLowerCase().includes(title.toLowerCase())) {
          albumIds.push(track.parentId);
        }
      });
      const { albums } = await library.albums(
        sectionId,
        new URLSearchParams({
          'album.id': albumIds.join(','),
          sort: SORT_ALBUMS_BY_RELEASE_DATE.desc,
        })
      );
      const releaseFilters = await window.api.getValue('release-filters');
      if (!releaseFilters) return albums;
      const [isFiltered] = releaseFilters.filter((filter) => filter.guid === guid);
      if (isFiltered) {
        return albums.filter((album) => !isFiltered.exclusions.includes(album.guid));
      }
      return albums;
    },
    placeholderData: keepPreviousData,
  });

export const useAlbumsArtistAppearsOn = (id: number, guid: string, title: string) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(albumsArtistAppearsOn(id, guid, library, sectionId, title));
};

export const albumsQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.ALBUMS, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.albums(sectionId, searchParams),
});

const useAlbums = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(albumsQuery(sectionId, library, searchParams));
};

export default useAlbums;
