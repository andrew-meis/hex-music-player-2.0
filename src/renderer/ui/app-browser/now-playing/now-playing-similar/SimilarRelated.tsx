import { observer, useUnmount } from '@legendapp/state/react';
import { ClickAwayListener } from '@mui/material';
import Scroller from 'components/virtuoso/Scroller';
import { selectActions } from 'features/select';
import { useRelatedTracks } from 'queries';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { store } from 'state';

import { Item } from '../NowPlayingSimilar';

const SimilarRelated: React.FC = observer(function SimilarRelated() {
  const tabIsAnimating = store.ui.nowPlaying.tabIsAnimating.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const { data: relatedTracks } = useRelatedTracks(nowPlaying.track, !tabIsAnimating);

  useUnmount(() => selectActions.handleClickAway());

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  if (!relatedTracks) return null;

  return (
    <ClickAwayListener
      onClickAway={(event) => {
        if (store.ui.select.items.peek() === relatedTracks) {
          selectActions.handleClickAway(event);
        }
      }}
    >
      <Virtuoso
        components={{
          Scroller,
        }}
        data={relatedTracks}
        isScrolling={handleScrollState}
        itemContent={(index, data) => <Item data={data} index={index} />}
        style={{
          height: 'calc(100% - 16px)',
          marginTop: 16,
          overscrollBehavior: 'contain',
          width: '100%',
        }}
        onMouseOver={() => store.ui.select.items.set(relatedTracks)}
      />
    </ClickAwayListener>
  );
});

export default SimilarRelated;
