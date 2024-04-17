import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library, Params } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const playlistsQuery = (library: Library, params: Params) =>
  queryOptions({
    queryKey: [QueryKeys.PLAYLISTS, params],
    queryFn: async () => library.playlists({ type: 'audio', ...params }),
  });

const usePlaylists = (params: Params) => {
  const library = store.library.get();
  return useQuery(playlistsQuery(library, params));
};

export default usePlaylists;
