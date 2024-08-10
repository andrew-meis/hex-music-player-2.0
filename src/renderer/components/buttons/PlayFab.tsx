import { Fab, SvgIcon } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { FaCirclePlay } from 'react-icons/fa6';

const MotionFab = motion(Fab);

const PlayFab: React.FC<React.ComponentProps<typeof MotionFab>> = ({ ...props }) => {
  return (
    <MotionFab
      size="small"
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        zIndex: 10,
        '&:hover': {
          backgroundColor: theme.palette.background.default,
        },
      })}
      whileHover={{ scale: 1.1 }}
      {...props}
    >
      <SvgIcon sx={(theme) => ({ color: theme.palette.primary.main, height: 42, width: 42 })}>
        <FaCirclePlay />
      </SvgIcon>
    </MotionFab>
  );
};

export default PlayFab;
