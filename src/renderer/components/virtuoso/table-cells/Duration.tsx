import { Typography } from '@mui/material';
import { Duration as LuxonDuration } from 'luxon';
import React from 'react';

const Duration: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <Typography color="text.secondary" variant="title2">
      {LuxonDuration.fromMillis(duration).toFormat('mm:ss')}
    </Typography>
  );
};

export default Duration;
