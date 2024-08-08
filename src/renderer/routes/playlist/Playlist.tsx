import { Typography } from '@mui/material';
import VirtualPlaylistItemTable from 'components/playlist/VirtualPlaylistItemTable';
import { usePlaylistItems } from 'queries';
import React, { useEffect } from 'react';
import { createSearchParams, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

import { playlistLoader } from './loader';

const Playlist: React.FC = () => {
  const { id, title } = useLoaderData() as Awaited<ReturnType<typeof playlistLoader>>;

  const selectObservable = allSelectObservables[SelectObservables.ROUTE_PLAYLIST];

  const { data } = usePlaylistItems(id);

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Playlists',
        to: {
          pathname: '/playlists',
          search: createSearchParams({ section: 'Playlists' }).toString(),
        },
      },
      {
        title,
        to: {
          pathname: `/playlists/${id}`,
          search: createSearchParams({ title }).toString(),
        },
      },
    ]);
  }, []);

  if (!data) return null;

  return (
    <RouteContainer>
      {({ viewport }) => (
        <>
          <Typography variant="h1">{title}</Typography>
          <VirtualPlaylistItemTable
            activeMenu={SelectObservables.ROUTE_PLAYLIST}
            items={data.items || []}
            state={selectObservable}
            viewport={viewport}
          />
        </>
      )}
    </RouteContainer>
  );
};

export default Playlist;
