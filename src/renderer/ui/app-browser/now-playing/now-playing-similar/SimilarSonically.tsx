import { observer, useUnmount } from '@legendapp/state/react';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useSimilarTracks } from 'queries';
import React, { useMemo } from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const SimilarSonically: React.FC = observer(function SimilarSonically() {
  const selectObservable = allSelectObservables[SelectObservables.UI_NOW_PLAYING];

  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const { data: similarTracks } = useSimilarTracks(nowPlaying.track, !tabIsAnimating);

  const slicedTracks = useMemo(() => similarTracks?.tracks.slice(0, 10), [similarTracks]);

  useUnmount(() => selectActions.handleClickAway(selectObservable));

  if (!similarTracks) return null;

  return (
    <VirtualTrackTable
      activeMenu={SelectObservables.UI_NOW_PLAYING}
      state={selectObservable}
      tracks={slicedTracks || []}
    />
  );
});

export default SimilarSonically;
