import { reactive, Show, useSelector } from '@legendapp/state/react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { store } from 'state';

import NowPlayingSurface from './now-playing/NowPlayingSurface';

const MotionBox = motion(Box);
const ReactiveBox = reactive(MotionBox);

const AppBrowser: React.FC = () => {
  const nowPlayingBool = useSelector(() => !!store.queue.nowPlaying.get());

  return (
    <ReactiveBox
      $animate={() => ({
        height: store.ui.overlay.get() ? 'calc(100vh - 154px)' : '100%',
      })}
      alignItems="center"
      display="flex"
      marginX="auto"
      maxWidth={1888}
      width="calc(100% - 16px)"
    >
      <Show if={nowPlayingBool}>
        <NowPlayingSurface />
      </Show>
    </ReactiveBox>
  );
};

export default AppBrowser;
