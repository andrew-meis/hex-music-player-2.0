import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const ArtistDiscography: React.FC = observer(function ArtistDiscography() {
  const { guid, id, title } = store.loaders.artistDiscography.get();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Artists',
        to: { pathname: '/artists', search: createSearchParams({ section: 'Artists' }).toString() },
      },
      {
        title,
        to: {
          pathname: `/artists/${id}`,
          search: createSearchParams({ guid, title, tabIndex: '0' }).toString(),
        },
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
        &nbsp;»&nbsp;Discography
      </Typography>
    </RouteContainer>
  );
});

export default ArtistDiscography;
