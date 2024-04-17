import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library, Params } from 'api';
import { store } from 'state';
import { QueryKeys, ServerConfig } from 'typescript';

export const collectionsQuery = (config: ServerConfig, library: Library, params?: Params) =>
  queryOptions({
    queryKey: [QueryKeys.COLLECTIONS, params],
    queryFn: async () => library.collections(config.sectionId, params),
  });

const useCollections = (params?: Params) => {
  const config = store.serverConfig.get();
  const library = store.library.get();
  return useQuery(collectionsQuery(config, library, params));
};

export default useCollections;
