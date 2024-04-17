import { Box, Typography } from '@mui/joy';
import React from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export const playlistLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) {
    throw new Error('Missing route loader data');
  }
  return { id: parseInt(id, 10) };
};

const Playlist: React.FC = () => {
  const { id } = useLoaderData() as Awaited<ReturnType<typeof playlistLoader>>;

  return (
    <Box marginX={4}>
      <Typography paddingY={2} level="h1">
        {id}
      </Typography>
    </Box>
  );
};

export default Playlist;
