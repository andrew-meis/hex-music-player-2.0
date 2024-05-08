import { Typography } from '@mui/material';
import { useInView } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

const RouteHeader: React.FC<{
  title: string;
}> = ({ title }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    console.log('Element is in view: ', isInView);
  }, [isInView]);

  return (
    <Typography paddingBottom={2} ref={ref} variant="h1">
      {title}
    </Typography>
  );
};

export default RouteHeader;
