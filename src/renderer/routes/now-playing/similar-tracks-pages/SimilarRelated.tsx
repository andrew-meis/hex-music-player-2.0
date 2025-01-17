import { observer, useUnmount } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useRelatedTracks } from 'queries';
import React from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const SimilarRelated: React.FC = observer(function SimilarRelated() {
  const selectObservable = allSelectObservables[SelectObservables.ROUTE_NOW_PLAYING];

  const nowPlaying = store.queue.nowPlaying.get();

  const { data: relatedTracks } = useRelatedTracks(nowPlaying.track);

  useUnmount(() => selectActions.handleClickAway(selectObservable));

  if (!relatedTracks) return null;

  if (relatedTracks.length === 0) {
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
          No related tracks found in Plex library.
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
      tracks={relatedTracks || []}
    />
  );
});

export default SimilarRelated;
