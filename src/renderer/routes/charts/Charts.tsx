import { observer } from '@legendapp/state/react';
import { Typography } from '@mui/material';
import { MediaType, TrackContainer } from 'api';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { DateTime } from 'luxon';
import { useChart } from 'queries';
import React, { useEffect } from 'react';
import RouteContainer from 'routes/RouteContainer';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const Charts: React.FC = observer(function Charts() {
  const { start, end } = store.loaders.charts.get();

  const selectObservable = allSelectObservables[SelectObservables.ROUTE_CHARTS];

  const { data } = useChart(
    MediaType.TRACK,
    DateTime.fromSeconds(start),
    DateTime.fromSeconds(end),
    100,
    true
  );

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Charts',
        to: { pathname: '/charts' },
      },
      {
        title: `${DateTime.fromSeconds(start).toLocaleString(DateTime.DATE_FULL)} – ${DateTime.fromSeconds(end).toLocaleString(DateTime.DATE_FULL)}`,
        to: {
          pathname: '/charts',
          search: new URLSearchParams({
            start: start.toString(),
            end: end.toString(),
          }).toString(),
        },
      },
    ]);
  }, [start, end]);

  return (
    <RouteContainer>
      {({ viewport }) => (
        <>
          <Typography variant="h1">Charts</Typography>
          <VirtualTrackTable
            useWindowScroll
            activeMenu={SelectObservables.ROUTE_CHARTS}
            columnOptions={{
              index: {
                showTableIndex: true,
              },
            }}
            state={selectObservable}
            tracks={(data as TrackContainer)?.tracks || []}
            viewport={viewport}
          />
        </>
      )}
    </RouteContainer>
  );
});

export default Charts;
