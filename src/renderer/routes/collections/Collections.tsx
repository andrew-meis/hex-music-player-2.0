import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { createSearchParams, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { store } from 'state';

export const collectionsLoader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const section = url.searchParams.get('section');
  if (!section) {
    throw new Error('Missing route loader data');
  }
  return { section };
};

const Collections: React.FC = () => {
  const { section } = useLoaderData() as Awaited<ReturnType<typeof collectionsLoader>>;

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Collections',
        to: {
          pathname: '/collections',
          search: createSearchParams({ section: 'Collections' }).toString(),
        },
      },
    ]);
  }, []);

  return (
    <RouteContainer>
      <Typography paddingBottom={2} variant="h1">
        {section}
      </Typography>
    </RouteContainer>
  );
};

export default Collections;
