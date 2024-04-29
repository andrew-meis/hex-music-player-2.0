import { Box, Fade, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import isAppInit from 'app/init-app';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorElement: React.FC = () => {
  const loggedIn = useQuery({
    queryKey: ['error-element'],
    queryFn: () => isAppInit(),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof loggedIn.data === 'boolean' && loggedIn.data === false) {
      navigate('/login');
    }
  }, [loggedIn.data]);

  if (loggedIn.isLoading) {
    return null;
  }

  if (typeof loggedIn.data === 'boolean' && loggedIn.data === true) {
    return (
      <Fade in>
        <Box
          alignItems="center"
          bgcolor="var(--mui-palette-background-default)"
          display="flex"
          flexDirection="column"
          height="100vh"
          justifyContent="center"
        >
          <Typography
            color="var(--mui-palette-text-primary)"
            fontFamily="TT Commons, sans-serif"
            fontWeight={700}
            variant="h4"
          >
            Oops!
          </Typography>
          <Typography color="var(--mui-palette-text-primary)">
            An unexpected error occurred.
          </Typography>
        </Box>
      </Fade>
    );
  }

  return null;
};

export default ErrorElement;
