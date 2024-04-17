import { Box, Divider, Sheet } from '@mui/joy';
import { motion, PanInfo, useDragControls } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import AppBrowser from 'ui/app-browser/AppBrowser';

import AudioControl from './AudioControl';
import NavLinks from './NavLinks';

const AppController: React.FC = () => {
  const dragControls = useDragControls();
  const location = useLocation();
  const navigation = useNavigation();
  const [isBrowserOpen, setBrowserOpen] = useState(false);

  useEffect(() => {
    if (navigation.state === 'idle') {
      setBrowserOpen(true);
    }
  }, [location.pathname, navigation.state]);

  const handleDragEnd = (_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const dragIcon = document.getElementById('drag-icon') as HTMLInputElement;
    if (dragIcon) {
      dragIcon.setAttribute('data-is-grabbed', 'false');
    }
    if (isBrowserOpen && info.offset.y > 50) {
      setBrowserOpen(false);
      return;
    }
    if (!isBrowserOpen && info.offset.y < -50) {
      setBrowserOpen(true);
    }
  };

  return (
    <Box
      bottom={8}
      display="block"
      mx={1}
      position="fixed"
      width="-webkit-fill-available"
      zIndex={10}
    >
      <Box marginX="auto" maxWidth={1920}>
        <motion.div
          layout
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragControls={dragControls}
          dragElastic={0.5}
          dragListener={false}
          style={{
            position: 'fixed',
            top: isBrowserOpen ? 40 : 'calc(100vh - 82px)',
            left: 0,
            right: 0,
          }}
          transition={{ type: 'spring', bounce: 0.25 }}
          onDragEnd={handleDragEnd}
        >
          <AppBrowser dragControls={dragControls} />
        </motion.div>
        <Box
          bgcolor="background.body"
          bottom={-8}
          height={12}
          left={-8}
          position="absolute"
          width="100vw"
        />
        <Box
          alignItems="center"
          borderRadius={8}
          component={Sheet}
          display="flex"
          height={60}
          justifyContent="space-between"
          paddingX={1}
          position="relative"
          variant="soft"
          width="-webkit-fill-available"
        >
          <AudioControl />
          <Divider orientation="vertical" sx={{ height: 44, margin: 1 }} />
          <NavLinks isBrowserOpen={isBrowserOpen} setBrowserOpen={setBrowserOpen} />
        </Box>
      </Box>
    </Box>
  );
};

export default AppController;
