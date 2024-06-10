import { Show } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { useArtist } from 'queries';
import React, { useEffect } from 'react';
import { createSearchParams, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

import { artistLoader } from './loader';

const Artist: React.FC = () => {
  const { guid, id, title } = useLoaderData() as Awaited<ReturnType<typeof artistLoader>>;
  const { data } = useArtist(id);

  console.log(data);

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
    ]);
  }, [id]);

  return (
    <Show ifReady={data}>
      {(value) => (
        <RouteContainer>
          <Typography paddingBottom={2} variant="h1">
            {title}
          </Typography>
        </RouteContainer>
      )}
    </Show>
  );
};

export default Artist;
