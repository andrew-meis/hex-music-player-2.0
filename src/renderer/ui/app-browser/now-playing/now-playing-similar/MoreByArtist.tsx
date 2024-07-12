import { observer, useUnmount } from '@legendapp/state/react';
import { SORT_TRACKS_BY_PLAYS } from 'api';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useArtistTracks } from 'queries';
import React, { useMemo } from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const MoreByArtist: React.FC = observer(function SimilarMoreByArtist() {
  const selectObservable = allSelectObservables[SelectObservables.UI_NOW_PLAYING];

  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const { data: artistTracks } = useArtistTracks(
    nowPlaying.track.grandparentGuid,
    nowPlaying.track.grandparentId,
    SORT_TRACKS_BY_PLAYS.desc,
    nowPlaying.track.grandparentTitle,
    !tabIsAnimating,
    true
  );

  useUnmount(() => selectActions.handleClickAway(selectObservable));

  const slicedTracks = useMemo(
    () => artistTracks?.filter((track) => track.guid !== nowPlaying.track.guid).slice(0, 50),
    [artistTracks]
  );

  if (!artistTracks) return null;

  return (
    <VirtualTrackTable
      activeMenu={SelectObservables.UI_NOW_PLAYING}
      state={selectObservable}
      tracks={slicedTracks || []}
    />
  );
});

export default MoreByArtist;
