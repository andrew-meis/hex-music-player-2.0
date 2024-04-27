import { Box, Typography } from '@mui/material';
import React from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export const albumLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) {
    throw new Error('Missing route loader data');
  }
  return { id: parseInt(id, 10) };
};

const Album: React.FC = () => {
  const { id } = useLoaderData() as Awaited<ReturnType<typeof albumLoader>>;

  return (
    <Box marginX={4}>
      <Typography paddingY={2} variant="h1">
        {id}
      </Typography>
    </Box>
  );
};

export default Album;
