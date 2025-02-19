import { Box } from '@mui/material';
import favicon from 'assets/favicon.svg';
import React from 'react';

const appInfo = await window.api.getAppInfo();

const Titlebar: React.FC = () => {
  return (
    <Box className="titlebar">
      {appInfo.platform !== 'macOS' && (
        <img
          alt="logo"
          src={favicon}
          style={{
            height: 24,
            width: 24,
            marginLeft: 8,
          }}
        />
      )}
    </Box>
  );
};

export default Titlebar;
