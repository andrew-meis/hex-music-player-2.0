import { Memo, Show } from '@legendapp/state/react';
import { Box, Divider } from '@mui/material';
import React from 'react';
import { store } from 'state';

import AudioControls from './audio-controls/AudioControls';
import Seekbar from './audio-controls/Seekbar';
import Volume from './audio-controls/Volume';
import QueueButton from './buttons/QueueButton';
import SearchButton from './buttons/SearchButton';
import NowPlaying from './now-playing/NowPlaying';
import NowPlayingColor from './now-playing/NowPlayingColor';

const BottomBar: React.FC = () => {
  return (
    <Box
      borderRadius={2}
      color="text.primary"
      height={76}
      margin={0.5}
      marginTop={0}
      sx={{
        contain: 'paint',
      }}
      width="-webkit-fill-available"
    >
      <Show ifReady={store.queue.nowPlaying}>
        <NowPlayingColor />
      </Show>
      <Memo>
        {() => {
          const swatch = store.ui.nowPlaying.swatch.get();
          return (
            <div
              style={{
                background: swatch.hex,
                height: '100%',
                mixBlendMode: 'color',
                opacity: 0.6,
                pointerEvents: 'none',
                position: 'absolute',
                width: '100%',
              }}
            />
          );
        }}
      </Memo>
      <Box
        alignItems="center"
        display="flex"
        height={64}
        justifyContent="space-between"
        paddingTop={0.25}
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
          <SearchButton />
          <QueueButton />
          <Divider orientation="vertical" sx={{ height: 36, marginX: 0.5 }} />
          <Volume />
        </Box>
      </Box>
      <Seekbar />
    </Box>
  );
};

export default BottomBar;
