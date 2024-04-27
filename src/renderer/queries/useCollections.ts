import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library, Params } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const collectionsQuery = (sectionId: number, library: Library, params?: Params) =>
  queryOptions({
    queryKey: [QueryKeys.COLLECTIONS, params],
    queryFn: async () => library.collections(sectionId, params),
  });

const useCollections = (params?: Params) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(collectionsQuery(sectionId, library, params));
};

export default useCollections;
