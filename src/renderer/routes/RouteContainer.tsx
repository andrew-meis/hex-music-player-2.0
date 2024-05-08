import { Box, BoxProps } from '@mui/material';

const RouteContainer = ({ children }: BoxProps) => (
  <Box display="flex" flexDirection="column" height={1} marginX={4}>
    {children}
  </Box>
);

export default RouteContainer;
