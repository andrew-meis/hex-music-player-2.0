import { Memo, reactive } from '@legendapp/state/react';
import { Box, Paper } from '@mui/material';
import noiseImage from 'assets/noise.bmp?url';
import { motion } from 'framer-motion';
import React from 'react';
import { store } from 'state';

import Seekbar from './audio-controls/Seekbar';
import Volume from './audio-controls/Volume';
import AudioControl from './AudioControl';
import NowPlayingSurface from './now-playing/NowPlayingSurface';
import NowPlayingInfo from './NowPlayingInfo';

const MotionBox = motion(Box);
const ReactiveBox = reactive(MotionBox);

const AppController: React.FC = () => {
  return (
    <Box
      bottom={8}
      display="block"
      marginX={1}
      position="fixed"
      width="-webkit-fill-available"
      zIndex={10}
    >
      <Box marginX="auto" maxWidth={1920}>
        <ReactiveBox
          $animate={() => ({
            background: store.ui.overlay.get()
              ? 'rgba(var(--mui-palette-background-defaultChannel) / 0.5)'
              : 'rgba(var(--mui-palette-background-defaultChannel) / 0)',
          })}
          $sx={() => ({
            height: 'calc(100vh - 154px)',
            left: 0,
            pointerEvents: store.ui.overlay.get() ? 'auto' : 'none',
            position: 'fixed',
            right: 0,
            top: 72,
          })}
          transition={{
            background: {
              duration: 0.3,
            },
          }}
          onClick={() => store.ui.overlay.set(false)}
        />
        <Box
          bgcolor="background.default"
          bottom={-8}
          height={8}
          left={-8}
          position="absolute"
          width="100vw"
          zIndex={10}
        />
        <ReactiveBox
          $animate={() => ({
            height: store.ui.overlay.get() ? 'calc(100vh - 82px)' : 74,
          })}
          $transition={() => (store.ui.overlay.get() ? { type: 'spring', bounce: 0.25 } : {})}
          alignItems="flex-end"
          borderRadius={2}
          component={Paper}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          position="relative"
          sx={{
            backgroundImage:
              'linear-gradient(to bottom left, var(--mui-palette-AppBar-defaultBg), var(--mui-palette-Button-inheritContainedBg))',
            boxShadow: 'none',
            contain: 'paint',
          }}
          width="-webkit-fill-available"
        >
          <div
            style={{
              backgroundImage: `url(${noiseImage})`,
              height: '100%',
              mixBlendMode: 'overlay',
              opacity: 0.05,
              pointerEvents: 'none',
              position: 'absolute',
              width: '100%',
            }}
          />
          <Memo>
            {() => {
              const color = store.ui.nowPlaying.color.get();
              return (
                <div
                  style={{
                    background: `radial-gradient(ellipse at top right, ${color.css()}, transparent), radial-gradient(circle at bottom left, ${color.css()}, transparent)`,
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
          <ReactiveBox
            $animate={() => ({ opacity: store.ui.overlay.get() ? 1 : 0 })}
            $sx={() => ({ pointerEvents: store.ui.overlay.get() ? 'inherit' : 'none' })}
            position="absolute"
            width={1}
          >
            <NowPlayingSurface />
          </ReactiveBox>
        </ReactiveBox>
        <Box
          alignItems="center"
          bottom={0}
          color="text.primary"
          display="flex"
          height={74}
          justifyContent="space-between"
          maxWidth={1904}
          paddingX={1}
          position="absolute"
          width="-webkit-fill-available"
        >
          <Box
            alignItems="center"
            display="flex"
            flexBasis="0%"
            flexGrow={1.3}
            justifyContent="flex-start"
          >
            <NowPlayingInfo />
          </Box>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            flexGrow={2}
            flexShrink={1}
            marginTop={1.5}
            marginX={1}
            maxWidth={600}
            minWidth={400}
          >
            <AudioControl />
            <Seekbar />
          </Box>
          <Box
            alignItems="center"
            display="flex"
            flexBasis="0%"
            flexGrow={1.3}
            justifyContent="flex-end"
          >
            <Volume />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppController;
