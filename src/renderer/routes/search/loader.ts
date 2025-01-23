import { LoaderFunctionArgs } from 'react-router-dom';
import { store } from 'state';

export const searchLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter') || 'top';
  const query = url.searchParams.get('query') || '';
  store.ui.search.input.set(query);
  store.loaders.search.set({ filter, query });
  return true;
};
