import { LoaderFunctionArgs } from 'react-router-dom';
import { store } from 'state';

export const trackLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const grandparentGuid = url.searchParams.get('grandparentGuid');
  const grandparentId = url.searchParams.get('grandparentId');
  const grandparentTitle = url.searchParams.get('grandparentTitle');
  const parentGuid = url.searchParams.get('parentGuid');
  const parentId = url.searchParams.get('parentId');
  const parentTitle = url.searchParams.get('parentTitle');
  const title = url.searchParams.get('title');
  if (
    !grandparentGuid ||
    !grandparentId ||
    !grandparentTitle ||
    !parentGuid ||
    !parentId ||
    !parentTitle ||
    !id ||
    !title
  ) {
    throw new Error('Missing route loader data');
  }
  store.loaders.track.set({
    grandparentGuid,
    grandparentId,
    grandparentTitle,
    id: parseInt(id, 10),
    parentGuid,
    parentId,
    parentTitle,
    title,
  });
  return true;
};
