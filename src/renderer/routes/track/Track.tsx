import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

const Track: React.FC = observer(function Track() {
  const {
    grandparentGuid,
    grandparentId,
    grandparentTitle,
    id,
    parentGuid,
    parentId,
    parentTitle,
    title,
  } = store.loaders.track.get();

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Artists',
        to: { pathname: '/artists', search: createSearchParams({ section: 'Artists' }).toString() },
      },
      {
        title: grandparentTitle,
        to: {
          pathname: `/artists/${grandparentId}`,
          search: createSearchParams({
            guid: grandparentGuid,
            title: grandparentTitle,
            tabIndex: '0',
          }).toString(),
        },
      },
      {
        title: parentTitle,
        to: {
          pathname: `/albums/${parentId}`,
          search: createSearchParams({
            guid: parentGuid,
            parentGuid: grandparentGuid,
            parentId: grandparentId,
            parentTitle: grandparentTitle,
            title: parentTitle,
          }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/tracks/${id}`,
          search: createSearchParams({
            grandparentGuid,
            grandparentId,
            grandparentTitle,
            parentGuid,
            parentId,
            parentTitle,
            title,
          }).toString(),
        },
      },
    ]);
  }, [id]);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        {title}
      </Typography>
    </RouteContainer>
  );
});

export default Track;
