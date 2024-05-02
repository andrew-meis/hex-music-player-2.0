import { Show } from '@legendapp/state/react';
import { Box, ClickAwayListener, Typography } from '@mui/material';
import QueueRow from 'components/queue/QueueRow';
import Scroller from 'components/virtuoso/Scroller';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { store } from 'state';
import { selectActions } from 'ui/select';

const Queue: React.FC = () => {
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
      <Typography paddingY={2} variant="h1">
        Queue
      </Typography>
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
                  Scroller,
                }}
                data={upcomingItems}
                isScrolling={handleScrollState}
                itemContent={(index, data) => <QueueRow index={index} queueItem={data} />}
                style={{ height: '100%', marginBottom: 16 }}
                onMouseEnter={() => store.ui.select.items.set(upcomingItems)}
              />
            </ClickAwayListener>
          );
        }}
      </Show>
    </Box>
  );
};

export default Queue;
