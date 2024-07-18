import { Show } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import VirtualPlaylistTable from 'components/playlist/VirtualPlaylistTable';
import Scroller from 'components/scroller/Scroller';
import { usePlaylistItems } from 'queries';
import React, { useEffect } from 'react';
import { createSearchParams, useLoaderData } from 'react-router-dom';
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

  return (
    <Scroller sx={{ height: '100%' }}>
      {({ viewport }) => (
        <Box marginX={4}>
          <Typography variant="h1">{title}</Typography>
          <Show ifReady={data}>
            {(value) => (
              <VirtualPlaylistTable
                activeMenu={SelectObservables.ROUTE_PLAYLIST}
                items={value?.items || []}
                state={selectObservable}
                viewport={viewport}
              />
            )}
          </Show>
        </Box>
      )}
    </Scroller>
  );
};

export default Playlist;
