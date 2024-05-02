import { Box, Typography } from '@mui/material';
import { uniq } from 'lodash';
import { useSearch } from 'queries';
import React, { useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
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
      persistedStore.recentSearches.set((prev) => uniq([query, ...prev]).slice(0, 999));
    }
  }, [query]);

  return (
    <Box display="flex" flexDirection="column" height={1} marginX={4}>
      <Typography paddingY={2} variant="h1">
        Search
      </Typography>
      <SearchInput query={query} />
      {query.length < 2 && !searchResults && <SearchHistory />}
      {query.length > 1 && searchResults && <SearchResults searchResults={searchResults} />}
    </Box>
  );
};

export default Search;
