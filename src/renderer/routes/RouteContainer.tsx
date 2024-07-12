import { Box, BoxProps } from '@mui/material';

const RouteContainer = ({ children, ...props }: BoxProps) => (
  <Box display="flex" flexDirection="column" height={1} marginX={4} {...props}>
    {children}
  </Box>
);

export default RouteContainer;
