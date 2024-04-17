import { Box } from '@mui/joy';
import favicon from 'assets/favicon.svg';
import React from 'react';

const Titlebar: React.FC = () => (
  <Box className="titlebar">
    <img
      data-tauri-drag-region
      alt="logo"
      src={favicon}
      style={{
        height: 32,
        width: 32,
        marginLeft: '4px',
      }}
    />
  </Box>
);

export default Titlebar;
