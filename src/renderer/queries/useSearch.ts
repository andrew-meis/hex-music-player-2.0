import { queryOptions, useQuery } from '@tanstack/react-query';
import { HubContainer, Library } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const searchQuery = (library: Library, query: string, limit: number) =>
  queryOptions({
    queryKey: [QueryKeys.SEARCH, query, limit],
    queryFn: () => library.searchAll(query, limit),
    enabled: query.length > 1,
    refetchOnWindowFocus: false,
    select: (data: HubContainer) => {
      if (!data.hubs) return [];
      return data.hubs
        .map((hub) => hub.items)
        .flat()
        .sort((a, b) => b.score! - a.score!);
    },
  });

const useSearch = (query: string, limit: number) => {
  const library = store.library.get();
  return useQuery(searchQuery(library, query, limit));
};

export default useSearch;
