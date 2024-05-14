import { observer, useUnmount } from '@legendapp/state/react';
import { ClickAwayListener } from '@mui/material';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import { useRecentTracks } from 'queries';
import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { store } from 'state';

import { Item } from '../NowPlayingSimilar';

const SimilarMoreByArtist: React.FC = observer(function SimilarMoreByArtist() {
  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const { data: recentTracks } = useRecentTracks(nowPlaying.track, 90, !tabIsAnimating);

  useUnmount(() => selectActions.handleClickAway());

  const slicedTracks = useMemo(
    () => recentTracks?.filter((track) => track.guid !== nowPlaying.track.guid).slice(0, 10),
    [recentTracks]
  );

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  if (!recentTracks) return null;

  return (
    <ClickAwayListener
      onClickAway={(event) => {
        if (store.ui.select.items.peek() === slicedTracks) {
          selectActions.handleClickAway(event);
        }
      }}
    >
      <Virtuoso
        components={{
          Scroller,
        }}
        data={slicedTracks}
        isScrolling={handleScrollState}
        itemContent={(index, data) => <Item data={data} index={index} />}
        style={{
          height: 'calc(100% - 16px)',
          marginTop: 16,
          overscrollBehavior: 'contain',
          width: '100%',
        }}
        onMouseOver={() => store.ui.select.items.set(slicedTracks)}
      />
    </ClickAwayListener>
  );
});

export default SimilarMoreByArtist;
