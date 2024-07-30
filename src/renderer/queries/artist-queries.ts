import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query';
import { AlbumContainer, ArtistContainer, Library, parseContainerType } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { ArtistKeys, QueryKeys } from 'typescript';

export const invalidateArtistQueries = async (queryClient: QueryClient) =>
  await queryClient.invalidateQueries({
    predicate: (query) => Object.values(ArtistKeys).includes(query.queryKey[0] as ArtistKeys),
  });

export const artistQuery = (id: number, library: Library) =>
  queryOptions({
    queryKey: [QueryKeys.ARTIST, id],
    queryFn: async () => {
      const {
        artists: [artist],
      } = await library.artist(id, {
        includeChildren: true,
        includePopularLeaves: true,
        includeRelated: true,
        includeRelatedCount: 5,
      });
      const hubsToFetch = artist.hubs
        .filter((hub) => hub.more)
        .filter((hub) => hub.hubIdentifier !== 'external.artist.similar.sonically');
      for (const hubToFetch of hubsToFetch) {
        const response = await library.fetch(hubToFetch.key);
        const container = parseContainerType(hubToFetch.type === 'artist' ? 8 : 9, response);
        const items =
          container._type === 'artistContainer'
            ? (container as ArtistContainer).artists
            : (container as AlbumContainer).albums;
        artist.hubs.find((hub) => hub.hubIdentifier === hubToFetch.hubIdentifier)!.items = items;
      }
      return artist;
    },
  });

export const useArtist = (id: number) => {
  const library = store.library.peek();
  return useQuery(artistQuery(id, library));
};

export const artistsQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.ARTISTS, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.artists(sectionId, searchParams),
});

export const useArtists = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(artistsQuery(sectionId, library, searchParams));
};
