import { useQuery } from '@tanstack/react-query';
import { Library, Params } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const artistsQuery = (sectionId: number, library: Library, params?: Params) => ({
  queryKey: [QueryKeys.ARTISTS, params],
  queryFn: async () => library.artists(sectionId, params),
});

const useArtists = (params?: Params) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(artistsQuery(sectionId, library, params));
};

export default useArtists;
