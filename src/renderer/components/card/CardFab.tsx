import { Fab, SvgIcon } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { FaCirclePlay } from 'react-icons/fa6';

const MotionFab = motion(Fab);

const buttonMotion = {
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
    y: -14,
  },
  initial: {
    opacity: 0,
    y: -2,
  },
};

const CardFab: React.FC<React.ComponentProps<typeof MotionFab>> = ({ ...props }) => {
  return (
    <motion.div
      style={{
        bottom: 0,
        right: 8,
        position: 'absolute',
      }}
      variants={buttonMotion}
    >
      <MotionFab
        size="small"
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
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
    </motion.div>
  );
};

export default CardFab;
