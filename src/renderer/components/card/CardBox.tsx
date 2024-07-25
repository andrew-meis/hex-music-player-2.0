import { Box, BoxProps } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);

const CardBox: React.FC<React.ComponentProps<typeof MotionBox> & BoxProps> = ({ sx, ...props }) => {
  return (
    <MotionBox
      initial="initial"
      sx={{
        borderRadius: 2,
        contain: 'paint',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'background-color 100ms ease-in-out',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        ...sx,
      }}
      whileHover="hover"
      {...props}
    >
      {props.children}
    </MotionBox>
  );
};

export default CardBox;
