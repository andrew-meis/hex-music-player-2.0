import { Box, BoxProps } from '@mui/joy';

const Result = ({ children, ...props }: BoxProps) => (
  <Box
    {...props}
    alignItems="center"
    borderRadius={4}
    display="flex"
    height={64}
    sx={{
      transition: 'background-color 100ms ease-in-out',
      '&:hover': {
        backgroundColor: 'background.level2',
      },
    }}
  >
    {children}
  </Box>
);

export default Result;
