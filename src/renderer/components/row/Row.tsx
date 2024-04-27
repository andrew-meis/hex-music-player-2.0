import { Box, BoxProps } from '@mui/material';

export interface RowOptions {
  showType?: boolean;
}

const Row = ({ children, ...props }: BoxProps) => (
  <Box
    {...props}
    alignItems="center"
    borderRadius={1}
    display="flex"
    height={64}
    sx={{
      transition: 'background-color 100ms ease-in-out',
      '&:hover': {
        backgroundColor: 'action.hover',
      },
    }}
  >
    {children}
  </Box>
);

export default Row;
