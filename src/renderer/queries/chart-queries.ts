import { queryOptions, useQuery } from '@tanstack/react-query';
import { MediaType } from 'api';
import { DateTime } from 'luxon';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const chartQuery = (
  mediaType: MediaType,
  enabled: boolean,
  start?: DateTime,
  end?: DateTime,
  days?: number
) =>
  queryOptions({
    queryKey: [QueryKeys.CHART, mediaType, start, end, days],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      const time = DateTime.now();
      if (days) {
        return library.topItems(sectionId, mediaType, time.minus({ days }), time, 10);
      }
      return library.topItems(sectionId, mediaType, start!, end!, 10);
    },
    enabled,
  });

export const useChart = (
  mediaType: MediaType,
  enabled = true,
  start = undefined,
  end = undefined,
  days = undefined
) => useQuery(chartQuery(mediaType, enabled, start, end, days));
