import { reactive } from '@legendapp/state/react';
import { Box, Paper } from '@mui/material';
import { motion, PanInfo, useDragControls } from 'framer-motion';
import React from 'react';
import { store } from 'state';
import AppBrowser from 'ui/app-browser/AppBrowser';

import Volume from './audio-controls/Volume';
import AudioControl from './AudioControl';
import NowPlayingThumbnail from './NowPlayingThumbnail';

const MotionDiv = reactive(motion.div);
const MotionBox = motion(Box);
const ReactiveBox = reactive(MotionBox);

const AppController: React.FC = () => {
  const dragControls = useDragControls();

  const handleDragEnd = (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const dragIcon = document.getElementById('drag-icon') as HTMLInputElement;
    if (dragIcon) {
      dragIcon.setAttribute('data-is-grabbed', 'false');
    }
    if (store.ui.overlay.peek() && info.offset.y > 50) {
      store.ui.overlay.set(false);
      return;
    }
    if (!store.ui.overlay.peek() && info.offset.y < -50) {
      store.ui.overlay.set(true);
    }
  };

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
            background: store.ui.overlay.get() ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
          })}
          sx={{
            height: 'calc(100vh - 160px)',
            left: 0,
            pointerEvents: 'none',
            position: 'fixed',
            right: 0,
            top: 80,
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
            top: store.ui.overlay.get() ? 80 : 'calc(100vh - 84px)',
          })}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragControls={dragControls}
          dragElastic={0.5}
          dragListener={false}
          style={{
            left: 0,
            position: 'fixed',
            right: 0,
          }}
          transition={{ type: 'spring', bounce: 0.25 }}
          onDragEnd={handleDragEnd}
        >
          <AppBrowser dragControls={dragControls} />
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
          height={60}
          justifyContent="space-between"
          paddingX={1}
          position="relative"
          width="-webkit-fill-available"
        >
          <AudioControl />
          <Volume />
          <NowPlayingThumbnail />
        </Box>
      </Box>
    </Box>
  );
};

export default AppController;
