import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const playlistQuery = (id: number, library: Library) =>
  queryOptions({
    queryKey: [QueryKeys.PLAYLIST, id],
    queryFn: () => library.playlist(id),
    placeholderData: keepPreviousData,
    select: (data) => data.playlists[0],
  });

export const usePlaylist = (id: number) => {
  const library = store.library.peek();
  return useQuery(playlistQuery(id, library));
};

export const playlistItemsQuery = (id: number, library: Library) =>
  queryOptions({
    queryKey: [QueryKeys.PLAYLIST_ITEMS, id],
    queryFn: () => library.playlistItems(id),
    placeholderData: keepPreviousData,
  });

export const usePlaylistItems = (id: number) => {
  const library = store.library.peek();
  return useQuery(playlistItemsQuery(id, library));
};

export const playlistsQuery = (library: Library, searchParams?: URLSearchParams) =>
  queryOptions({
    queryKey: [QueryKeys.PLAYLISTS, paramsToObject(searchParams?.entries())],
    queryFn: async () => library.playlists(searchParams),
  });

export const usePlaylists = (searchParams?: URLSearchParams) => {
  const library = store.library.get();
  return useQuery(playlistsQuery(library, searchParams));
};
