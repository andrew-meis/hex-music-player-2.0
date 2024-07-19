import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const queueQuery = (library: Library, id: number, center: number | undefined = undefined) =>
  queryOptions({
    queryKey: [QueryKeys.PLAYQUEUE, id],
    queryFn: () => library.playQueue(id, center, 0),
    enabled: id !== 0,
  });

export const useQueue = (id: number, center?: number) => {
  const library = store.library.get();
  return useQuery(queueQuery(library, id, center));
};
