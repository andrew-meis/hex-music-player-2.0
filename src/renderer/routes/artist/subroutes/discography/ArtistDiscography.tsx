import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

export const artistDiscographyLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const guid = url.searchParams.get('guid');
  const title = url.searchParams.get('title');
  if (!guid || !id || !title) {
    throw new Error('Missing route loader data');
  }
  return { guid, id: parseInt(id, 10), title };
};

const ArtistDiscography: React.FC = () => {
  const { guid, id, title } = useLoaderData() as Awaited<
    ReturnType<typeof artistDiscographyLoader>
  >;

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Artists',
        to: { pathname: '/artists', search: createSearchParams({ section: 'Artists' }).toString() },
      },
      {
        title,
        to: { pathname: `/artists/${id}`, search: createSearchParams({ guid, title }).toString() },
      },
      {
        title: 'Discography',
        to: {
          pathname: `/artists/${id}/discography`,
          search: createSearchParams({ guid, title }).toString(),
        },
      },
    ]);
  }, [id]);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        {title}
        &nbsp;» Discography
      </Typography>
    </RouteContainer>
  );
};

export default ArtistDiscography;
