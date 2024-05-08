import { Show } from '@legendapp/state/react';
import { Box, ClickAwayListener } from '@mui/material';
import QueueRow from 'components/queue/QueueRow';
import Scroller from 'components/virtuoso/Scroller';
import React, { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import RouteHeader from 'routes/RouteHeader';
import { store } from 'state';
import { selectActions } from 'ui/select';

const Queue: React.FC = () => {
  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Queue',
        to: { pathname: '/queue' },
      },
    ]);
  }, []);

  const handleScrollState = (isScrolling: boolean) => {
    if (isScrolling) {
      document.body.classList.add('disable-hover');
    }
    if (!isScrolling) {
      document.body.classList.remove('disable-hover');
    }
  };

  return (
    <Box display="flex" flexDirection="column" height={1} marginX={4}>
      <Show ifReady={store.queue.currentQueue.items}>
        {() => {
          const queue = store.queue.currentQueue.get();
          const currentIndex = queue.items.findIndex((item) => item.id === queue.selectedItemId);
          const upcomingItems = queue.items.slice(currentIndex + 1);
          return (
            <ClickAwayListener
              onClickAway={(event) => {
                if (store.ui.select.items.peek() === upcomingItems) {
                  selectActions.handleClickAway(event);
                }
              }}
            >
              <Virtuoso
                components={{
                  Header: () => <RouteHeader title="Queue" />,
                  Scroller,
                }}
                data={upcomingItems}
                isScrolling={handleScrollState}
                itemContent={(index, data) => <QueueRow index={index} queueItem={data} />}
                style={{ height: '100%' }}
                onMouseOver={() => store.ui.select.items.set(upcomingItems)}
              />
            </ClickAwayListener>
          );
        }}
      </Show>
    </Box>
  );
};

export default Queue;
