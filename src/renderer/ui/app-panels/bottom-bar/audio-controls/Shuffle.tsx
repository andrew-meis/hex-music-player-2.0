import { IconButton, SvgIcon } from '@mui/material';
import React from 'react';
import { TbArrowsShuffle } from 'react-icons/tb';

const Shuffle: React.FC = () => {
  return (
    <IconButton
      sx={{
        padding: 1,
      }}
    >
      <SvgIcon sx={{ width: 22, height: 22 }}>
        <TbArrowsShuffle />
      </SvgIcon>
    </IconButton>
  );
};

export default Shuffle;
