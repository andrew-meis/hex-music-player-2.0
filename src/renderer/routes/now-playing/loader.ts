import { LoaderFunctionArgs } from 'react-router-dom';

export const nowPlayingLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const tab = url.searchParams.get('tab') || 'lyrics';
  return {
    tab,
  };
};
