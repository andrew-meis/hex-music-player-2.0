import { observer, useUnmount } from '@legendapp/state/react';
import { Box, CircularProgress, Typography } from '@mui/material';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useLastfmMatchTracks } from 'queries';
import React from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const SimilarLastfm: React.FC = observer(function SimilarLastfm() {
  const selectObservable = allSelectObservables[SelectObservables.ROUTE_NOW_PLAYING];

  const nowPlaying = store.queue.nowPlaying.get();

  const { data: lastfmMatchTracks, isLoading } = useLastfmMatchTracks(nowPlaying.track);

  useUnmount(() => selectActions.handleClickAway(selectObservable));

  if (isLoading) {
    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        height={1}
        justifyContent="center"
        width={1}
      >
        <CircularProgress size="2rem" />
        <Typography color="text.secondary" paddingTop={1} variant="h5">
          Searching for last.fm similar tracks...
        </Typography>
      </Box>
    );
  }

  if (!lastfmMatchTracks) return null;

  if (lastfmMatchTracks.tracks.length === 0) {
    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        height={1}
        justifyContent="center"
        width={1}
      >
        <Typography color="text.secondary" variant="h5">
          {lastfmMatchTracks.reason}
        </Typography>
      </Box>
    );
  }

  return (
    <VirtualTrackTable
      activeMenu={SelectObservables.ROUTE_NOW_PLAYING}
      columnVisibility={{ duration: false, index: false }}
      state={selectObservable}
      style={{
        height: 'calc(100% - 8px)',
        marginTop: 8,
      }}
      tracks={lastfmMatchTracks.tracks || []}
    />
  );
});

export default SimilarLastfm;
