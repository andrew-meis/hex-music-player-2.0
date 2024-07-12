import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AppSurface: React.FC = () => (
  <Box
    color="text.primary"
    height="var(--content-height)"
    marginX="auto"
    marginY={1}
    maxWidth={1920}
    position="relative"
    top={40}
    width="calc(100% - 16px)"
  >
    <Outlet />
  </Box>
);

export default AppSurface;
