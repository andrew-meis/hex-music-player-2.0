import { Typography } from '@mui/material';
import { uniq } from 'lodash';
import React, { useEffect } from 'react';
import { createSearchParams, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { persistedStore, store } from 'state';

import SearchHistory from './SearchHistory';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

interface loaderReturn {
  filter: string;
  query: string;
}

export const searchLoader = async ({ request }: LoaderFunctionArgs): Promise<loaderReturn> => {
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter') || 'top';
  const query = url.searchParams.get('query') || '';
  store.ui.search.input.set(query);
  return {
    filter,
    query,
  };
};

const Search: React.FC = () => {
  const { filter, query } = useLoaderData() as Awaited<loaderReturn>;

  useEffect(() => {
    const searchInputElement = document.getElementById('search-input') as HTMLInputElement;
    if (searchInputElement) {
      searchInputElement.focus();
    }
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      persistedStore.recentSearches.set((prev) => uniq([query, ...prev]).slice(0, 32));
    }
  }, [query]);

  useEffect(() => {
    store.ui.breadcrumbs.set([
      { title: 'Home', to: { pathname: '/' } },
      {
        title: 'Search',
        to: { pathname: '/search' },
      },
      ...(query
        ? [
            {
              title: query,
              to: { pathname: `/search`, search: createSearchParams({ query }).toString() },
            },
          ]
        : []),
    ]);
  }, [query]);

  return (
    <RouteContainer flexDirection="column">
      <Typography paddingBottom={2} variant="h1">
        Search
      </Typography>
      <SearchInput />
      <span style={{ display: 'block', marginTop: 16, width: '100%' }} />
      {query.length < 2 && <SearchHistory />}
      {query.length > 1 && <SearchResults filter={filter} query={query} />}
    </RouteContainer>
  );
};

export default Search;
