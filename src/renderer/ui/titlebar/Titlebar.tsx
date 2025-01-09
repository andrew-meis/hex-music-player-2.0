import { Box } from '@mui/material';
import React from 'react';

import NavigationBreadcrumbs from './NavigationBreadcrumbs';
import NavigationButtons from './NavigationButtons';

const appInfo = await window.api.getAppInfo();

const Titlebar: React.FC = () => {
  return (
    <Box
      alignItems="center"
      display="flex"
      height={36}
      marginLeft={appInfo.platform === 'macOS' ? 8 : 0}
      width="100vw"
    >
      <NavigationButtons />
      <NavigationBreadcrumbs />
      <Box className="titlebar-spacer" />
    </Box>
  );
};

export default Titlebar;
