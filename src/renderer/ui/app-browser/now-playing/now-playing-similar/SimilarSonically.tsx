import { observer, useUnmount } from '@legendapp/state/react';
import { ClickAwayListener } from '@mui/material';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import { useSimilarTracks } from 'queries';
import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { store } from 'state';

import { Item } from '../NowPlayingSimilar';

const SimilarSonically: React.FC = observer(function SimilarSonically() {
  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const { data: similarTracks } = useSimilarTracks(nowPlaying.track, !tabIsAnimating);

  const slicedTracks = useMemo(() => similarTracks?.tracks.slice(0, 10), [similarTracks]);

  useUnmount(() => selectActions.handleClickAway());

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  if (!similarTracks) return null;

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

export default SimilarSonically;
