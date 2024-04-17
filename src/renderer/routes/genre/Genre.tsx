import { Box, Typography } from '@mui/joy';
import React from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export const genreLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const title = url.searchParams.get('title');
  if (!id || !title) {
    throw new Error('Missing route loader data');
  }
  return { id: parseInt(id, 10), title };
};

const Genre: React.FC = () => {
  const { id, title } = useLoaderData() as Awaited<ReturnType<typeof genreLoader>>;

  return (
    <Box marginX={4}>
      <Typography paddingY={2} level="h1">
        {title}
      </Typography>
    </Box>
  );
};

export default Genre;
