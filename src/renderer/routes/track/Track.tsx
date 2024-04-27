import { Box, Typography } from '@mui/material';
import React from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export const trackLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const artist = url.searchParams.get('artist');
  const title = url.searchParams.get('title');
  if (!artist || !id || !title) {
    throw new Error('Missing route loader data');
  }
  return { artist, id: parseInt(id, 10), title };
};

const Track: React.FC = () => {
  const { artist, id, title } = useLoaderData() as Awaited<ReturnType<typeof trackLoader>>;

  return (
    <Box marginX={4}>
      <Typography paddingY={2} variant="h1">
        {artist}
        {title}
      </Typography>
    </Box>
  );
};

export default Track;
