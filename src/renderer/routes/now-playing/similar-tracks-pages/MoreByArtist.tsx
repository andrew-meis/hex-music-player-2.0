import { observer, useUnmount } from '@legendapp/state/react';
import { Box, CircularProgress, Typography } from '@mui/material';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useAlbumsArtistAppearsOn, useRecentTracksByArtist } from 'queries';
import React, { useMemo } from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const MoreByArtist: React.FC = observer(function SimilarMoreByArtist() {
  const selectObservable = allSelectObservables[SelectObservables.UI_NOW_PLAYING];

  const nowPlaying = store.queue.nowPlaying.get();

  const { data: appearsOn } = useAlbumsArtistAppearsOn(
    nowPlaying.track.grandparentGuid,
    nowPlaying.track.grandparentId,
    nowPlaying.track.grandparentTitle
  );

  const recentTrackQueryIDs = useMemo(() => {
    if (!appearsOn) return [];
    return [nowPlaying.track.grandparentId, ...appearsOn.map((album) => album.id)];
  }, [appearsOn]);

  const { data: recentTracks, isLoading } = useRecentTracksByArtist(
    nowPlaying.track.grandparentGuid,
    nowPlaying.track.grandparentId,
    nowPlaying.track.grandparentTitle,
    recentTrackQueryIDs,
    undefined,
    100,
    recentTrackQueryIDs.length > 0
  );

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
          {`Finding your favorite recent tracks by ${nowPlaying.track.grandparentTitle}`}
        </Typography>
      </Box>
    );
  }

  if (!recentTracks) return null;

  if (recentTracks.length === 0) {
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
      columnOptions={{ userRating: { showSubtext: 'popularity' } }}
      columnVisibility={{ duration: false, index: false }}
      state={selectObservable}
      tracks={recentTracks.filter((track) => track.id !== nowPlaying.track.id) || []}
    />
  );
});

export default MoreByArtist;
