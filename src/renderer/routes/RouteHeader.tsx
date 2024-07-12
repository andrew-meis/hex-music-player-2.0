import { Typography } from '@mui/material';
// import { useInView } from 'framer-motion';
import React, { useRef } from 'react';

const RouteHeader: React.FC<{
  title: string;
}> = ({ title }) => {
  const ref = useRef(null);
  // const isInView = useInView(ref);

  return (
    <Typography paddingBottom={2} ref={ref} variant="h1">
      {title}
    </Typography>
  );
};

export default RouteHeader;
