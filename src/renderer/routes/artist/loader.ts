import { LoaderFunctionArgs } from 'react-router-dom';

export const artistLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const guid = url.searchParams.get('guid');
  const title = url.searchParams.get('title');
  if (!guid || !id || !title) {
    throw new Error('Missing route loader data');
  }
  return { guid, id: parseInt(id, 10), title };
};
