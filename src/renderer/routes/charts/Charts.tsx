import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const Charts: React.FC = () => {
  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Charts',
        to: { pathname: '/charts' },
      },
    ]);
  }, []);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        Charts
      </Typography>
    </RouteContainer>
  );
};

export default Charts;
