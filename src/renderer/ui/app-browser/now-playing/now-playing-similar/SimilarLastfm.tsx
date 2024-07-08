import { observer, useUnmount } from '@legendapp/state/react';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useLastfmMatchTracks } from 'queries';
import React from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const SimilarLastfm: React.FC = observer(function SimilarLastfm() {
  const selectObservable = allSelectObservables[SelectObservables.UI_NOW_PLAYING];

  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const { data: lastfmMatchTracks } = useLastfmMatchTracks(nowPlaying.track, !tabIsAnimating);

  useUnmount(() => selectActions.handleClickAway(selectObservable));

  if (!lastfmMatchTracks) return null;

  return (
    <VirtualTrackTable
      activeMenu={SelectObservables.UI_NOW_PLAYING}
      state={selectObservable}
      tracks={lastfmMatchTracks || []}
    />
  );
});

export default SimilarLastfm;
