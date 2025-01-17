import { Button, SvgIcon, Tooltip, Typography } from '@mui/material';
import chroma from 'chroma-js';
import { Color } from 'chroma-js';
import { motion } from 'framer-motion';
import React from 'react';

const MotionButton = motion(Button);

const ActionButton: React.FC<
  {
    children: React.ReactNode;
    color: Color;
    key: string;
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  } & Omit<React.ComponentProps<typeof MotionButton>, 'color'>
> = ({ children, color, key, label, onClick, ...props }) => {
  return (
    <Tooltip
      key={key}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -4],
              },
            },
          ],
        },
      }}
      title={<Typography variant="subtitle1">{label}</Typography>}
    >
      <MotionButton
        animate={{ scale: [0, 1.25, 1], transition: { delay: 0.3 } }}
        exit={{ scale: 0 }}
        initial={{ scale: 0 }}
        sx={{
          background: color.css(),
          color: chroma.contrast(color, '#fff') > 4.5 ? '#fff' : '#000',
          minWidth: 0,
          padding: 0.5,
          zIndex: 100,
          '&:hover': {
            background: color.brighten(2).css(),
          },
          ...props.sx,
        }}
        variant="contained"
        onClick={onClick}
      >
        <SvgIcon>{children}</SvgIcon>
      </MotionButton>
    </Tooltip>
  );
};

export default ActionButton;
