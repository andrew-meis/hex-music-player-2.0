import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const playlistsQuery = (library: Library, searchParams?: URLSearchParams) =>
  queryOptions({
    queryKey: [QueryKeys.PLAYLISTS, paramsToObject(searchParams?.entries())],
    queryFn: async () => library.playlists(searchParams),
  });

const usePlaylists = (searchParams?: URLSearchParams) => {
  const library = store.library.get();
  return useQuery(playlistsQuery(library, searchParams));
};

export default usePlaylists;
