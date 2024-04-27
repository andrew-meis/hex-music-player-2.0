import { Box, Typography } from '@mui/material';
import React from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export const artistsLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const title = url.searchParams.get('title');
  if (!title) {
    throw new Error('Missing route loader data');
  }
  return { title };
};

const Artists: React.FC = () => {
  const { title } = useLoaderData() as Awaited<ReturnType<typeof artistsLoader>>;

  return (
    <Box marginX={4}>
      <Typography paddingY={2} variant="h1">
        {title}
      </Typography>
    </Box>
  );
};

export default Artists;
