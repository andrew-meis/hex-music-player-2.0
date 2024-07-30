import { observer, useUnmount } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import { SORT_TRACKS_BY_PLAYS } from 'api';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useTracksByArtist } from 'queries';
import React, { useMemo } from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const MoreByArtist: React.FC = observer(function SimilarMoreByArtist() {
  const selectObservable = allSelectObservables[SelectObservables.UI_NOW_PLAYING];

  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const { data: artistTracks } = useTracksByArtist(
    nowPlaying.track.grandparentGuid,
    nowPlaying.track.grandparentId,
    nowPlaying.track.grandparentTitle,
    SORT_TRACKS_BY_PLAYS.desc,
    !tabIsAnimating,
    true
  );

  useUnmount(() => selectActions.handleClickAway(selectObservable));

  const slicedTracks = useMemo(
    () => artistTracks?.filter((track) => track.guid !== nowPlaying.track.guid).slice(0, 50),
    [artistTracks]
  );

  if (!artistTracks) return null;

  if (artistTracks.length === 1) {
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
          No other tracks found in Plex library
        </Typography>
      </Box>
    );
  }

  return (
    <VirtualTrackTable
      activeMenu={SelectObservables.UI_NOW_PLAYING}
      state={selectObservable}
      tracks={slicedTracks || []}
    />
  );
});

export default MoreByArtist;
