import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

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

const Album: React.FC = () => {
  const { guid, id, parentGuid, parentId, parentTitle, title } = useLoaderData() as Awaited<
    ReturnType<typeof albumLoader>
  >;

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Artists',
        to: { pathname: '/artists', search: createSearchParams({ section: 'Artists' }).toString() },
      },
      {
        title: parentTitle,
        to: {
          pathname: `/artists/${parentId}`,
          search: createSearchParams({
            guid: parentGuid,
            title: parentTitle,
            tabIndex: '0',
          }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/albums/${id}`,
          search: createSearchParams({ guid, parentGuid, parentId, parentTitle, title }).toString(),
        },
      },
    ]);
  }, [id]);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        {id}
      </Typography>
    </RouteContainer>
  );
};

export default Album;
