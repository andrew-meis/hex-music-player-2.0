import { Typography } from '@mui/material';
import React from 'react';

const RouteHeader: React.FC<{
  title: string;
}> = ({ title }) => {
  return (
    <Typography paddingBottom={2} variant="h1">
      {title}
    </Typography>
  );
};

export default RouteHeader;
