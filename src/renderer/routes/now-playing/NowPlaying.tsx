import { Show } from '@legendapp/state/react';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams } from 'react-router-dom';
import { store } from 'state';

import NowPlayingTabs from './NowPlayingTabs';

const NowPlaying: React.FC = () => {
  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Now Playing',
        to: {
          pathname: '/now-playing',
          search: createSearchParams({ tab: 'metadata' }).toString(),
        },
      },
    ]);
  }, []);

  return (
    <Show else={<Box height={1} width={1} />} ifReady={store.queue.nowPlaying}>
      <Box height={1} width={1}>
        <NowPlayingTabs />
      </Box>
    </Show>
  );
};

export default NowPlaying;
