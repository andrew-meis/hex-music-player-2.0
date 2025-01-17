import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AppSurface: React.FC = () => (
  <Box
    color="text.primary"
    height="var(--content-height)"
    maxWidth={1920}
    minHeight="var(--content-height)"
    width={1}
  >
    <Outlet />
  </Box>
);

export default AppSurface;
