import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query';
import { Library } from 'api';
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
      return library.artist(id, {
        includeChildren: true,
        includePopularLeaves: true,
        includeRelated: true,
        includeRelatedCount: 20,
      });
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
