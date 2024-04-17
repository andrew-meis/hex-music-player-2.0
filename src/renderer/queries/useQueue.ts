import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library, PlayQueue } from 'api';
import { persistedStore, store } from 'state';
import { QueryKeys } from 'typescript';

export const queueQuery = <TData = PlayQueue>(
  library: Library,
  id: number,
  center: number | undefined = undefined,
  select: undefined | ((data: PlayQueue) => TData) = undefined
) =>
  queryOptions({
    queryKey: [QueryKeys.PLAYQUEUE, id],
    queryFn: () => library.playQueue(id, center, 0),
    enabled: id !== 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    select,
  });

const useQueue = <TData = PlayQueue>(
  id?: number,
  center?: number,
  select?: (data: PlayQueue) => TData
) => {
  const savedQueueId = persistedStore.queueid.get();
  const library = store.library.get();
  return useQuery(queueQuery(library, id || savedQueueId, center, select));
};

export default useQueue;
