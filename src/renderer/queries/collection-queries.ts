import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const collectionsQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) =>
  queryOptions({
    queryKey: [QueryKeys.COLLECTIONS, paramsToObject(searchParams?.entries())],
    queryFn: async () => library.collections(sectionId, searchParams),
  });

export const useCollections = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(collectionsQuery(sectionId, library, searchParams));
};
