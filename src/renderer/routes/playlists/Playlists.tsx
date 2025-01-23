import { observer } from '@legendapp/state/react';
import { ClickAwayListener, Typography } from '@mui/material';
import PlaylistCard from 'components/playlist/PlaylistCard';
import Scroller from 'components/scroller/Scroller';
import { List } from 'components/virtuoso/CustomGridComponents';
import { selectActions } from 'features/select';
import { motion } from 'framer-motion';
import useScrollRestoration from 'hooks/useScrollRestoration';
import { useWidth } from 'hooks/useWidth';
import { usePlaylists } from 'queries';
import React, { useEffect } from 'react';
import { createSearchParams, useLocation } from 'react-router-dom';
import { GridItemProps, VirtuosoGrid } from 'react-virtuoso';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

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

const Playlists: React.FC = observer(function Playlists() {
  const location = useLocation();
  const [initial, handleScroll, scrollerProps, setReady] = useScrollRestoration(location.key);

  const { section } = store.loaders.playlists.get();
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
    <Scroller style={{ height: '100%', ...scrollerProps }} onScroll={handleScroll}>
      {({ viewport }) => {
        return (
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
            <Typography paddingBottom={2} variant="h1">
              {section}
            </Typography>
            <ClickAwayListener
              onClickAway={(event) => selectActions.handleClickAway(selectObservable, event)}
            >
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
            </ClickAwayListener>
          </motion.div>
        );
      }}
    </Scroller>
  );
});

export default Playlists;
