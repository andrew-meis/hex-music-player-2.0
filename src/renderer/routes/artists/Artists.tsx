import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const Artists: React.FC = observer(function Artists() {
  const { section } = store.loaders.artists.get();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Artists',
        to: { pathname: '/artists', search: createSearchParams({ section: 'Artists' }).toString() },
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

export default Artists;
