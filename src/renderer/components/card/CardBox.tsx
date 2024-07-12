import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);

const CardBox: React.FC<React.ComponentProps<typeof MotionBox>> = ({ ...props }) => {
  return (
    <MotionBox
      initial="initial"
      sx={(theme) => ({
        borderRadius: 2,
        contain: 'paint',
        cursor: 'pointer',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
        transition: '300ms',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      })}
      whileHover="hover"
      {...props}
    >
      {props.children}
    </MotionBox>
  );
};

export default CardBox;
