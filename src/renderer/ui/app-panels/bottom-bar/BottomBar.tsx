import { Show } from '@legendapp/state/react';
import { Box } from '@mui/material';
import React from 'react';
import { store } from 'state';

import AudioControls from './audio-controls/AudioControls';
import Seekbar from './audio-controls/Seekbar';
import Volume from './audio-controls/Volume';
import ChartsButton from './buttons/ChartsButton';
import PlaylistsButton from './buttons/PlaylistsButton';
import QueueButton from './buttons/QueueButton';
import NowPlaying from './now-playing/NowPlaying';
import NowPlayingColor from './now-playing/NowPlayingColor';

const BottomBar: React.FC = () => {
  return (
    <Box
      borderRadius={2}
      color="text.primary"
      display="flex"
      flexDirection="column"
      height={76}
      justifyContent="flex-end"
      sx={{
        transform: 'translateZ(0)',
      }}
      width="-webkit-fill-available"
    >
      <Seekbar />
      <Show ifReady={store.queue.nowPlaying}>
        <NowPlayingColor />
      </Show>
      <Box
        alignItems="center"
        display="flex"
        height={64}
        justifyContent="space-between"
        paddingBottom={1}
        paddingX={1}
      >
        <Box
          alignItems="center"
          display="flex"
          flexBasis="0%"
          flexGrow={1}
          justifyContent="flex-start"
          maxWidth={368}
        >
          <Show ifReady={store.queue.nowPlaying}>
            <NowPlaying />
          </Show>
        </Box>
        <AudioControls />
        <Box
          alignItems="center"
          display="flex"
          flexBasis="0%"
          flexGrow={1}
          justifyContent="flex-end"
          maxWidth={368}
        >
          <PlaylistsButton />
          <ChartsButton />
          <QueueButton />
          <Volume />
        </Box>
      </Box>
    </Box>
  );
};

export default BottomBar;
