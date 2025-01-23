import { LoaderFunctionArgs } from 'react-router-dom';
import { store } from 'state';

export const artistsLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const section = url.searchParams.get('section');
  if (!section) {
    throw new Error('Missing route loader data');
  }
  store.loaders.artists.set({ section });
  return true;
};
