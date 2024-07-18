import { LoaderFunctionArgs } from 'react-router-dom';

export const playlistLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const title = url.searchParams.get('title');
  if (!id || !title) {
    throw new Error('Missing route loader data');
  }
  return { id: parseInt(id, 10), title };
};
