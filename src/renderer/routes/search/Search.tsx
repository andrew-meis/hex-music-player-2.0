import { Typography } from '@mui/material';
import { uniq } from 'lodash';
import { useSearch } from 'queries';
import React, { useEffect } from 'react';
import { createSearchParams, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { persistedStore, store } from 'state';

import SearchHistory from './SearchHistory';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

interface loaderReturn {
  query: string;
}

export const searchLoader = async ({ request }: LoaderFunctionArgs): Promise<loaderReturn> => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || '';
  store.ui.search.input.set(query);
  return {
    query,
  };
};

const Search: React.FC = () => {
  const { query } = useLoaderData() as Awaited<loaderReturn>;

  const { data: searchResults } = useSearch(query, 10);

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
      {query.length < 2 && !searchResults && <SearchHistory />}
      {query.length > 1 && searchResults && <SearchResults searchResults={searchResults} />}
    </RouteContainer>
  );
};

export default Search;
