import { Box, Divider } from '@mui/material';
import React from 'react';
import SearchInput from 'routes/search/SearchInput';
import BottomBar from 'ui/app-panels/bottom-bar/BottomBar';
import Drawers from 'ui/app-panels/drawers/Drawers';
import AppSurface from 'ui/app-surface/AppSurface';
import NavigationBreadcrumbs from 'ui/titlebar/NavigationBreadcrumbs';
import NavigationButtons from 'ui/titlebar/NavigationButtons';

const AppLayout: React.FC = () => {
  return (
    <Box width={1}>
      <Drawers />
      <Box
        alignItems="center"
        display="flex"
        height={56}
        justifyContent="space-between"
        paddingX={1}
        width="-webkit-fill-available"
      >
        <NavigationButtons />
        <NavigationBreadcrumbs />
        <SearchInput />
      </Box>
      <Divider sx={{ marginX: 1 }} />
      <Box
        height="var(--content-height)"
        margin={1}
        position="relative"
        width="calc(100vw - 16px)"
        zIndex={0}
      >
        <AppSurface />
      </Box>
      <Divider sx={{ marginX: 1 }} />
      <BottomBar />
    </Box>
  );
};

export default AppLayout;
