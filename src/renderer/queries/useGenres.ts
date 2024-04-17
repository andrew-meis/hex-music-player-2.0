import { useQuery } from '@tanstack/react-query';
import { Library, MediaType, Params } from 'api';
import { store } from 'state';
import { QueryKeys, ServerConfig } from 'typescript';

export const genresQuery = (
  config: ServerConfig,
  library: Library,
  type: MediaType,
  params?: Params
) => ({
  queryKey: [QueryKeys.GENRES, type, params],
  queryFn: async () => library.genres(config.sectionId, type, params),
});

const useGenres = (type: MediaType, params?: Params) => {
  const config = store.serverConfig.get();
  const library = store.library.get();
  return useQuery(genresQuery(config, library, type, params));
};

export default useGenres;
