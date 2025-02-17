import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { shouldUpdateFavorite } from 'components/virtuoso/table-cells/Favorite';
import { useTracks } from 'queries';
import React, { useEffect, useMemo } from 'react';
import RouteContainer from 'routes/RouteContainer';
import { allSelectObservables, persistedStore, store } from 'state';
import { SelectObservables } from 'typescript';

const CurrentFavorites: React.FC = observer(function CurrentFavorites() {
  const favorites = persistedStore.currentFavorites.get();
  const selectObservable = allSelectObservables[SelectObservables.ROUTE_CURRENT_FAVORITES];

  const { data } = useTracks(
    new URLSearchParams({
      'track.id': Object.keys(favorites).join(','),
    })
  );

  const filteredTracks = useMemo(() => {
    if (!data) return [];
    return data.tracks.filter((track) => {
      return !shouldUpdateFavorite(track.lastViewedAt, favorites[track.id]);
    });
  }, [data]);

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Current Favorites',
        to: {
          pathname: '/current-favorites',
        },
      },
    ]);
  }, []);

  return (
    <RouteContainer>
      {({ viewport }) => (
        <>
          <Typography variant="h1">Current Favorites</Typography>
          <VirtualTrackTable
            useWindowScroll
            activeMenu={SelectObservables.ROUTE_CURRENT_FAVORITES}
            columnOptions={{
              index: {
                showTableIndex: true,
              },
            }}
            state={selectObservable}
            tracks={filteredTracks || []}
            viewport={viewport}
          />
        </>
      )}
    </RouteContainer>
  );
});

export default CurrentFavorites;
