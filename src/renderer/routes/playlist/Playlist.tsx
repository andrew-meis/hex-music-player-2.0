import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

export const playlistLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const title = url.searchParams.get('title');
  if (!id || !title) {
    throw new Error('Missing route loader data');
  }
  return { id: parseInt(id, 10), title };
};

const Playlist: React.FC = () => {
  const { id, title } = useLoaderData() as Awaited<ReturnType<typeof playlistLoader>>;

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Playlists',
        to: {
          pathname: '/playlists',
          search: createSearchParams({ section: 'Playlists' }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/playlists/${id}`,
          search: createSearchParams({ title }).toString(),
        },
      },
    ]);
  }, []);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        {id}
      </Typography>
    </RouteContainer>
  );
};

export default Playlist;
