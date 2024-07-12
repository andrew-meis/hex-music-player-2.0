import { reactive } from '@legendapp/state/react';
import { Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { store } from 'state';
import AppBrowser from 'ui/app-browser/AppBrowser';

import Seekbar from './audio-controls/Seekbar';
import Volume from './audio-controls/Volume';
import AudioControl from './AudioControl';
import NowPlayingInfo from './NowPlayingInfo';

const MotionDiv = reactive(motion.div);
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
          sx={{
            height: 'calc(100vh - 154px)',
            left: 0,
            pointerEvents: 'none',
            position: 'fixed',
            right: 0,
            top: 72,
          }}
          transition={{
            background: {
              duration: 0.3,
            },
          }}
        />
        <MotionDiv
          layout
          $animate={() => ({
            top: store.ui.overlay.get() ? 72 : 'calc(100vh - 82px)',
          })}
          style={{
            left: 0,
            position: 'fixed',
            right: 0,
          }}
          transition={{ type: 'spring', bounce: 0.25 }}
        >
          <AppBrowser />
        </MotionDiv>
        <Box
          bgcolor="background.default"
          bottom={-8}
          height={16}
          left={-8}
          position="absolute"
          width="100vw"
        />
        <Box
          alignItems="center"
          borderRadius={2}
          component={Paper}
          display="flex"
          height={74}
          justifyContent="space-between"
          paddingX={1}
          position="relative"
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
