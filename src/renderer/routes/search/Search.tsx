import { Typography } from '@mui/material';
import { uniq } from 'lodash';
import React, { useEffect } from 'react';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import RouteContainer from 'routes/RouteContainer';
import { persistedStore, store } from 'state';

import SearchHistory from './SearchHistory';
import SearchResults from './SearchResults';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

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
    <RouteContainer style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography paddingBottom={2} variant="h1">
        Search
      </Typography>
      {query.length < 2 && <SearchHistory />}
      {query.length > 1 && <SearchResults />}
    </RouteContainer>
  );
};

export default Search;
