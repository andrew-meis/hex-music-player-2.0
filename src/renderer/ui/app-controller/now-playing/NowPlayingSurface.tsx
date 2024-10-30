import { Show, useSelector } from '@legendapp/state/react';
import { Box } from '@mui/material';
import React from 'react';
import { store } from 'state';

import NowPlayingColor from './NowPlayingColor';
import NowPlayingContent from './NowPlayingContent';

const NowPlayingSurface: React.FC = () => {
  const nowPlayingBool = useSelector(() => !!store.queue.nowPlaying.get());

  return (
    <Show if={nowPlayingBool}>
      <Box
        alignItems="center"
        bottom={0}
        display="flex"
        flexShrink={0}
        overflow="hidden"
        top={0}
        width={1}
      >
        <NowPlayingColor />
        <Box display="flex" height="calc(100vh - 154px)" position="relative" width={1}>
          <NowPlayingContent />
        </Box>
      </Box>
    </Show>
  );
};

export default NowPlayingSurface;
