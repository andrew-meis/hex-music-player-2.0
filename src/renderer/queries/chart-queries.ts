import { queryOptions, useQuery } from '@tanstack/react-query';
import { MediaType } from 'api';
import { DateTime } from 'luxon';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const chartQuery = (
  mediaType: MediaType,
  start: DateTime,
  end: DateTime,
  limit: number = 10,
  enabled: boolean = true
) =>
  queryOptions({
    queryKey: [QueryKeys.CHART, mediaType, start, end, limit],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      return library.topItems(sectionId, mediaType, start, end, limit);
    },
    enabled,
  });

export const useChart = (
  mediaType: MediaType,
  start: DateTime,
  end: DateTime,
  limit?: number,
  enabled?: boolean
) => useQuery(chartQuery(mediaType, start, end, limit, enabled));
