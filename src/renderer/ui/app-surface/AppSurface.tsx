import { observer, Show } from '@legendapp/state/react';
import { Box } from '@mui/joy';
import React from 'react';
import { store } from 'state';

import NowPlayingSurface from './now-playing/NowPlayingSurface';

const AppSurface: React.FC = observer(function AppSurface() {
  return (
    <Box
      borderRadius={2}
      color="text.primary"
      display="flex"
      height="calc(100vh - 130px)"
      marginX="auto"
      marginY={1}
      maxHeight={1080}
      maxWidth={1920}
      position="relative"
      width="calc(100% - 16px)"
    >
      <Show if={store.audio.nowPlaying.get()}>
        <NowPlayingSurface />
      </Show>
    </Box>
  );
});

export default AppSurface;
