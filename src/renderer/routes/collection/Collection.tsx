import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const Collection: React.FC = observer(function Collection() {
  const { id, title } = store.loaders.collection.get();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Collections',
        to: {
          pathname: '/collections',
          search: createSearchParams({ section: 'Collections' }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/collections/${id}`,
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
});

export default Collection;
