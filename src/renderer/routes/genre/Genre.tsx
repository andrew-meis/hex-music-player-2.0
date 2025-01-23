import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const Genre: React.FC = observer(function Genre() {
  const { id, title } = store.loaders.genre.get();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Genres',
        to: {
          pathname: '/genres',
          search: createSearchParams({ section: 'Genres' }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/genres/${id}`,
          search: createSearchParams({ title }).toString(),
        },
      },
    ]);
  }, []);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        {title}
      </Typography>
    </RouteContainer>
  );
});

export default Genre;
