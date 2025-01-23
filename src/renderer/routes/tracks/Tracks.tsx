import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const Tracks: React.FC = observer(function Tracks() {
  const { section } = store.loaders.tracks.get();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Tracks',
        to: { pathname: '/tracks', search: createSearchParams({ section: 'Tracks' }).toString() },
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

export default Tracks;
