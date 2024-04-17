import { useQuery } from '@tanstack/react-query';
import { Library, Params } from 'api';
import { store } from 'state';
import { QueryKeys, ServerConfig } from 'typescript';

export const artistsQuery = (config: ServerConfig, library: Library, params?: Params) => ({
  queryKey: [QueryKeys.ARTISTS, params],
  queryFn: async () => library.artists(config.sectionId, params),
});

const useArtists = (params?: Params) => {
  const config = store.serverConfig.get();
  const library = store.library.get();
  return useQuery(artistsQuery(config, library, params));
};

export default useArtists;
