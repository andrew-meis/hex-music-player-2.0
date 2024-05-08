import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
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
  return {
    grandparentGuid,
    grandparentId,
    grandparentTitle,
    id: parseInt(id, 10),
    parentGuid,
    parentId,
    parentTitle,
    title,
  };
};

const Track: React.FC = () => {
  const {
    grandparentGuid,
    grandparentId,
    grandparentTitle,
    id,
    parentGuid,
    parentId,
    parentTitle,
    title,
  } = useLoaderData() as Awaited<ReturnType<typeof trackLoader>>;

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Artists',
        to: { pathname: '/artists', search: createSearchParams({ section: 'Artists' }).toString() },
      },
      {
        title: grandparentTitle,
        to: {
          pathname: `/artists/${grandparentId}`,
          search: createSearchParams({ guid: grandparentGuid, title: grandparentTitle }).toString(),
        },
      },
      {
        title: parentTitle,
        to: {
          pathname: `/albums/${parentId}`,
          search: createSearchParams({
            guid: parentGuid,
            parentGuid: grandparentGuid,
            parentId: grandparentId,
            parentTitle: grandparentTitle,
            title: parentTitle,
          }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/tracks/${id}`,
          search: createSearchParams({
            grandparentGuid,
            grandparentId,
            grandparentTitle,
            parentGuid,
            parentId,
            parentTitle,
            title,
          }).toString(),
        },
      },
    ]);
  }, [id]);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        {title}
      </Typography>
    </RouteContainer>
  );
};

export default Track;
