import { observer, useUnmount } from '@legendapp/state/react';
import VirtualTrackTable from 'components/track/VirtualTrackTable';
import { selectActions } from 'features/select';
import { useRelatedTracks } from 'queries';
import React from 'react';
import { allSelectObservables, store } from 'state';
import { SelectObservables } from 'typescript';

const SimilarRelated: React.FC = observer(function SimilarRelated() {
  const selectObservable = allSelectObservables[SelectObservables.UI_NOW_PLAYING];

  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const { data: relatedTracks } = useRelatedTracks(nowPlaying.track, !tabIsAnimating);

  useUnmount(() => selectActions.handleClickAway(selectObservable));

  if (!relatedTracks) return null;

  return (
    <VirtualTrackTable
      activeMenu={SelectObservables.UI_NOW_PLAYING}
      state={selectObservable}
      tracks={relatedTracks || []}
    />
  );
});

export default SimilarRelated;
