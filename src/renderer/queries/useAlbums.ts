import { useQuery } from '@tanstack/react-query';
import { Library, Params } from 'api';
import { store } from 'state';
import { QueryKeys, ServerConfig } from 'typescript';

export const albumsQuery = (config: ServerConfig, library: Library, params?: Params) => ({
  queryKey: [QueryKeys.ALBUMS, params],
  queryFn: async () => library.albums(config.sectionId, params),
});

const useAlbums = (params?: Params) => {
  const config = store.serverConfig.get();
  const library = store.library.get();
  return useQuery(albumsQuery(config, library, params));
};

export default useAlbums;
