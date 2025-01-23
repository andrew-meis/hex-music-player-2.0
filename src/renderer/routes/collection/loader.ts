import { LoaderFunctionArgs } from 'react-router-dom';
import { store } from 'state';

export const collectionLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const title = url.searchParams.get('title');
  if (!id || !title) {
    throw new Error('Missing route loader data');
  }
  store.loaders.collection.set({ id: parseInt(id, 10), title });
  return true;
};
