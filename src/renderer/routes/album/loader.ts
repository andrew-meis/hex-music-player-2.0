import { LoaderFunctionArgs } from 'react-router-dom';

export const albumLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const guid = url.searchParams.get('guid');
  const parentGuid = url.searchParams.get('parentGuid');
  const parentId = url.searchParams.get('parentId');
  const parentTitle = url.searchParams.get('parentTitle');
  const title = url.searchParams.get('title');
  if (!guid || !id || !parentGuid || !parentId || !parentTitle || !title) {
    throw new Error('Missing route loader data');
  }
  return { guid, id: parseInt(id, 10), parentGuid, parentId, parentTitle, title };
};
