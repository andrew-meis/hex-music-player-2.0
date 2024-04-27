import { Box, Paper, SvgIcon } from '@mui/material';
import { DragControls } from 'framer-motion';
import React from 'react';
import { LiaMinusSolid } from 'react-icons/lia';
import { Outlet } from 'react-router-dom';

const AppBrowser: React.FC<{
  dragControls: DragControls;
}> = ({ dragControls }) => {
  const startDrag = (event: React.PointerEvent<SVGSVGElement>) => {
    const dragIcon = document.getElementById('drag-icon') as HTMLInputElement;
    if (dragIcon) {
      dragIcon.setAttribute('data-is-grabbed', 'true');
    }
    dragControls.start(event);
  };

  const endDrag = () => {
    const dragIcon = document.getElementById('drag-icon') as HTMLInputElement;
    if (dragIcon) {
      dragIcon.setAttribute('data-is-grabbed', 'false');
    }
  };

  return (
    <Box
      borderRadius={2}
      component={Paper}
      height="calc(100vh - 40px - 76px)"
      maxWidth={1920}
      mx="auto"
      width="calc(100% - 16px)"
    >
      <SvgIcon
        data-is-grabbed="false"
        id="drag-icon"
        sx={{
          color: 'text.secondary',
          cursor: 'grab',
          position: 'absolute',
          left: 0,
          right: 0,
          top: -2,
          margin: 'auto',
          '&:hover': {
            color: 'text.primary',
          },
        }}
        onPointerDown={startDrag}
        onPointerUp={endDrag}
      >
        <LiaMinusSolid />
      </SvgIcon>
      <Outlet />
    </Box>
  );
};

export default AppBrowser;
