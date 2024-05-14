import { observer, useUnmount } from '@legendapp/state/react';
import { ClickAwayListener } from '@mui/material';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import { useLastfmMatchTracks } from 'queries';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { store } from 'state';

import { Item } from '../NowPlayingSimilar';

const SimilarLastfm: React.FC = observer(function SimilarLastfm() {
  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const { data: lastfmMatchTracks } = useLastfmMatchTracks(nowPlaying.track, !tabIsAnimating);

  useUnmount(() => selectActions.handleClickAway());

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  if (!lastfmMatchTracks) return null;

  return (
    <ClickAwayListener
      onClickAway={(event) => {
        if (store.ui.select.items.peek() === lastfmMatchTracks) {
          selectActions.handleClickAway(event);
        }
      }}
    >
      <Virtuoso
        components={{
          Scroller,
        }}
        data={lastfmMatchTracks}
        isScrolling={handleScrollState}
        itemContent={(index, data) => <Item data={data} index={index} />}
        style={{
          height: 'calc(100% - 16px)',
          marginTop: 16,
          overscrollBehavior: 'contain',
          width: '100%',
        }}
        onMouseOver={() => store.ui.select.items.set(lastfmMatchTracks)}
      />
    </ClickAwayListener>
  );
});

export default SimilarLastfm;
