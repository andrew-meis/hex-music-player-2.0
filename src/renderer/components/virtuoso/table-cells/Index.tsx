import { Typography } from '@mui/material';
import React from 'react';

const Index: React.FC<{ index: number }> = ({ index }) => {
  return (
    <Typography color="text.secondary" variant="title2">
      {index}
    </Typography>
  );
};

export default Index;
