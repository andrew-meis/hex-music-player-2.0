import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const queueQuery = (
  library: Library,
  id: number,
  center: number | undefined = undefined,
  repeat: 0 | 1
) =>
  queryOptions({
    queryKey: [QueryKeys.PLAYQUEUE, id, center, repeat],
    queryFn: () => library.playQueue(id, center, repeat),
    enabled: id !== 0,
    placeholderData: keepPreviousData,
  });

export const useQueue = (id: number, repeat: 0 | 1, center: number | undefined) => {
  const library = store.library.get();
  return useQuery(queueQuery(library, id, center, repeat));
};
