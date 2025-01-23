import { LoaderFunctionArgs } from 'react-router-dom';
import { store } from 'state';

export const tracksLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const section = url.searchParams.get('section');
  if (!section) {
    throw new Error('Missing route loader data');
  }
  store.loaders.tracks.set({ section });
  return true;
};
