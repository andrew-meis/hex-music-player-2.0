import { queryOptions, useQuery } from '@tanstack/react-query';
import { MediaType } from 'api';
import { DateTime } from 'luxon';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const chartQuery = (
  mediaType: MediaType,
  enabled: boolean = true,
  limit: number = 10,
  start?: DateTime,
  end?: DateTime,
  days?: number
) =>
  queryOptions({
    queryKey: [QueryKeys.CHART, mediaType, start, end, days, limit],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      const time = DateTime.now();
      if (days) {
        return library.topItems(sectionId, mediaType, time.minus({ days }), time, limit);
      }
      return library.topItems(sectionId, mediaType, start!, end!, limit);
    },
    enabled,
  });

export const useChart = (
  mediaType: MediaType,
  enabled?: boolean,
  limit?: number,
  start?: DateTime,
  end?: DateTime,
  days?: number
) => useQuery(chartQuery(mediaType, enabled, limit, start, end, days));
