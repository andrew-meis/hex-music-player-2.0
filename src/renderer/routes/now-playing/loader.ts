import { LoaderFunctionArgs } from 'react-router-dom';
import { store } from 'state';

export const nowPlayingLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const tab = url.searchParams.get('tab') || 'metadata';
  store.loaders.nowPlaying.set({ tab });
  return true;
};
