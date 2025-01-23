import { DateTime } from 'luxon';
import { LoaderFunctionArgs } from 'react-router-dom';
import { store } from 'state';

export const chartsLoader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  if (!start || !end) {
    store.loaders.charts.set({
      start: DateTime.now().startOf('day').minus({ days: 7 }).toUnixInteger(),
      end: DateTime.now().endOf('day').toUnixInteger(),
    });
    return true;
  }
  store.loaders.charts.set({
    start: parseInt(start, 10),
    end: parseInt(end, 10),
  });
  return true;
};
