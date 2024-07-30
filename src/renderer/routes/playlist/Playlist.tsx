import { Typography } from '@mui/material';
import VirtualPlaylistTable from 'components/playlist/VirtualPlaylistTable';
import Scroller from 'components/scroller/Scroller';
import { motion } from 'framer-motion';
import useScrollRestoration from 'hooks/useScrollRestoration';
import { usePlaylistItems } from 'queries';
import React, { useEffect } from 'react';
import { createSearchParams, useLoaderData, useLocation } from 'react-router-dom';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

import { playlistLoader } from './loader';

const Playlist: React.FC = () => {
  const location = useLocation();
  const [initial, handleScroll, scrollerProps, setReady] = useScrollRestoration(location.key);

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
    <Scroller sx={{ height: '100%', ...scrollerProps }} onScroll={handleScroll}>
      {({ viewport }) => (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key={location.pathname}
          style={{ height: 'fit-content', margin: '0 32px' }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          onViewportEnter={() => {
            if (!viewport) return;
            viewport.scrollTop = initial;
            if (viewport.scrollTop === initial) {
              setReady(true);
            }
          }}
        >
          <Typography variant="h1">{title}</Typography>
          <VirtualPlaylistTable
            activeMenu={SelectObservables.ROUTE_PLAYLIST}
            items={data.items || []}
            state={selectObservable}
            viewport={viewport}
          />
        </motion.div>
      )}
    </Scroller>
  );
};

export default Playlist;
