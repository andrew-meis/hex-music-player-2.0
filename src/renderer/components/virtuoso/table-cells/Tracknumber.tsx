import { Typography } from '@mui/material';
import React from 'react';

const Tracknumber: React.FC<{ tracknumber: number }> = ({ tracknumber }) => {
  return (
    <Typography color="text.secondary" variant="title2">
      {tracknumber}
    </Typography>
  );
};

export default Tracknumber;
