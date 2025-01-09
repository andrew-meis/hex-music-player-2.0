import { observer, useUnmount } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useSimilarTracks } from 'queries';
import React, { useMemo } from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const SimilarSonically: React.FC = observer(function SimilarSonically() {
  const selectObservable = allSelectObservables[SelectObservables.UI_NOW_PLAYING];

  const nowPlaying = store.queue.nowPlaying.get();

  const { data: similarTracks } = useSimilarTracks(nowPlaying.track);

  const slicedTracks = useMemo(() => similarTracks?.tracks.slice(0, 10), [similarTracks]);

  useUnmount(() => selectActions.handleClickAway(selectObservable));

  if (!similarTracks) return null;

  if (similarTracks.tracks.length === 0) {
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
          No sonically similar tracks found in Plex library
        </Typography>
      </Box>
    );
  }

  return (
    <VirtualTrackTable
      activeMenu={SelectObservables.UI_NOW_PLAYING}
      columnVisibility={{ duration: false, index: false }}
      state={selectObservable}
      tracks={slicedTracks || []}
    />
  );
});

export default SimilarSonically;
