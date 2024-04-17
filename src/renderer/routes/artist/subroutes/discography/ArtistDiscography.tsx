import { Box, Typography } from '@mui/joy';
import React from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

export const artistDiscographyLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { id } = params;
  const url = new URL(request.url);
  const guid = url.searchParams.get('guid');
  const title = url.searchParams.get('title');
  if (!guid || !id || !title) {
    throw new Error('Missing route loader data');
  }
  return { guid, id: parseInt(id, 10), title };
};

const ArtistDiscography: React.FC = () => {
  const { guid, id, title } = useLoaderData() as Awaited<
    ReturnType<typeof artistDiscographyLoader>
  >;

  console.dir(guid);
  console.dir(id);

  return (
    <Box marginX={4}>
      <Typography paddingY={2} level="h1">
        {title}
        &nbsp;» Discography
      </Typography>
    </Box>
  );
};

export default ArtistDiscography;
