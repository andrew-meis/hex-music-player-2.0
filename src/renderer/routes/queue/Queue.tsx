import { Show } from '@legendapp/state/react';
import { Box, Typography } from '@mui/material';
import QueueRow from 'components/queue/QueueRow';
import Scroller from 'components/virtuoso/Scroller';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { store } from 'state';

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
      <Show ifReady={store.audio.queue.items}>
        {() => {
          const queue = store.audio.queue.get();
          const currentIndex = queue.items.findIndex((item) => item.id === queue.selectedItemId);
          const upcoming = queue.items.slice(currentIndex + 1);
          return (
            <Virtuoso
              components={{
                Scroller,
              }}
              data={upcoming}
              isScrolling={handleScrollState}
              itemContent={(_index, data) => <QueueRow queueItem={data} />}
              style={{ height: '100%', marginBottom: 16 }}
            />
          );
        }}
      </Show>
    </Box>
  );
};

export default Queue;
