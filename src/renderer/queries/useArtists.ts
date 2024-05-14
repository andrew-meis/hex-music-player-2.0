import { useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const artistsQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.ARTISTS, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.artists(sectionId, searchParams),
});

const useArtists = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(artistsQuery(sectionId, library, searchParams));
};

export default useArtists;
