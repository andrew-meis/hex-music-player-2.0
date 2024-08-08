import { SvgIcon, Typography } from '@mui/material';
import React from 'react';
import { BiAlbum } from 'react-icons/bi';

const Discnumber: React.FC<{ discnumber: number }> = ({ discnumber }) => {
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <SvgIcon sx={{ color: 'text.secondary', width: 56, height: 20 }}>
        <BiAlbum />
      </SvgIcon>
      <Typography color="text.secondary" variant="title1">{`Disc ${discnumber}`}</Typography>
    </div>
  );
};

export default Discnumber;
