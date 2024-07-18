import { Box, Typography } from '@mui/material';
import PlaylistCard from 'components/playlist/PlaylistCard';
import Scroller from 'components/scroller/Scroller';
import { List } from 'components/virtuoso/CustomGridComponents';
import { useWidth } from 'hooks/useWidth';
import { usePlaylists } from 'queries';
import React, { useEffect } from 'react';
import { createSearchParams, useLoaderData } from 'react-router-dom';
import { GridItemProps, VirtuosoGrid } from 'react-virtuoso';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

import { playlistsLoader } from './loader';

const breakpointMap = {
  xs: 3,
  sm: 4,
  md: 5,
  lg: 6,
  xl: 7,
};

const Item: React.FC<GridItemProps> = ({ children, ...props }) => {
  const breakpoint = useWidth();
  return (
    <div
      {...props}
      style={{
        padding: 4,
        width: `${Math.floor(100 / breakpointMap[breakpoint])}%`,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};

const Playlists: React.FC = () => {
  const { section } = useLoaderData() as Awaited<ReturnType<typeof playlistsLoader>>;
  const selectObservable = allSelectObservables[SelectObservables.ROUTE_PLAYLISTS];

  const { data: playlistsData } = usePlaylists();

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
    ]);
  }, []);

  if (!playlistsData) return null;

  return (
    <Scroller style={{ height: '100%' }}>
      {({ viewport }) => {
        return (
          <Box marginX={4}>
            <Typography paddingBottom={2} variant="h1">
              {section}
            </Typography>
            <VirtuosoGrid
              components={{ List, Item }}
              customScrollParent={viewport}
              data={playlistsData.playlists}
              itemContent={(index, data) => (
                <PlaylistCard index={index} playlist={data} state={selectObservable} />
              )}
              style={{
                minHeight: 'var(--content-height)',
                scrollbarWidth: 'none',
              }}
              totalCount={playlistsData.playlists.length}
              onMouseOver={() => {
                store.ui.menus.activeMenu.set(SelectObservables.ROUTE_PLAYLISTS);
                selectObservable.items.set(playlistsData.playlists);
              }}
            />
          </Box>
        );
      }}
    </Scroller>
  );
};

export default Playlists;
