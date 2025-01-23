import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const Albums: React.FC = observer(function Albums() {
  const { section } = store.loaders.albums.get();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Albums',
        to: { pathname: '/albums', search: createSearchParams({ section: 'Albums' }).toString() },
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

export default Albums;
