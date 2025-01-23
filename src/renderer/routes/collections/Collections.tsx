import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const Collections: React.FC = observer(function Collections() {
  const { section } = store.loaders.collections.get();

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
    ]);
  }, []);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        {section}
      </Typography>
    </RouteContainer>
  );
});

export default Collections;
