import { Box } from '@mui/material';
import React from 'react';
import BottomBar from 'ui/app-panels/bottom-bar/BottomBar';
import LibraryDrawer from 'ui/app-panels/library-drawer/LibraryDrawer';
import QueueDrawer from 'ui/app-panels/queue-drawer/QueueDrawer';
import AppSurface from 'ui/app-surface/AppSurface';
import Titlebar from 'ui/titlebar/Titlebar';

const AppLayout: React.FC = () => {
  return (
    <>
      <LibraryDrawer />
      <QueueDrawer />
      <Box display="flex" height="calc(100vh - 80px)">
        <Box width={1}>
          <Titlebar />
          <AppSurface />
        </Box>
      </Box>
      <BottomBar />
    </>
  );
};

export default AppLayout;
