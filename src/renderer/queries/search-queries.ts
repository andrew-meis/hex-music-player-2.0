import { queryOptions, useQuery } from '@tanstack/react-query';
import { HubContainer, Library } from 'api';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const searchQuery = (library: Library, query: string, limit: number) =>
  queryOptions({
    queryKey: [QueryKeys.SEARCH, query, limit],
    queryFn: () => library.searchAll(query, limit),
    enabled: query.length > 1,
    select: (data: HubContainer) => {
      if (!data.hubs) return [];
      return data.hubs
        .map((hub) => hub.items)
        .flat()
        .sort((a, b) => b.score! - a.score!);
    },
  });

export const useSearch = (query: string, limit: number) => {
  const library = store.library.get();
  return useQuery(searchQuery(library, query, limit));
};

export const searchAlbums = (
  sectionId: number,
  library: Library,
  query: string,
  limit: number,
  enabled: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.SEARCH_ALBUMS, query, limit],
    queryFn: () => library.searchAlbums(sectionId, query, limit),
    enabled,
  });

export const useSearchAlbums = (query: string, limit: number, enabled = true) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.get();
  return useQuery(searchAlbums(sectionId, library, query, limit, enabled));
};

export const searchArtists = (
  sectionId: number,
  library: Library,
  query: string,
  limit: number,
  enabled: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.SEARCH_ARTISTS, query, limit],
    queryFn: () => library.searchArtists(sectionId, query, limit),
    enabled,
  });

export const useSearchArtists = (query: string, limit: number, enabled = true) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.get();
  return useQuery(searchArtists(sectionId, library, query, limit, enabled));
};

export const searchCollections = (
  sectionId: number,
  library: Library,
  query: string,
  limit: number,
  enabled: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.SEARCH_COLLECTIONS, query, limit],
    queryFn: () => library.searchCollections(sectionId, query, limit),
    enabled,
  });

export const useSearchCollections = (query: string, limit: number, enabled = true) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.get();
  return useQuery(searchCollections(sectionId, library, query, limit, enabled));
};

export const searchGenres = (
  sectionId: number,
  library: Library,
  query: string,
  enabled: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.SEARCH_GENRES, query],
    queryFn: () => library.searchGenres(sectionId, query),
    enabled,
  });

export const useSearchGenres = (query: string, enabled = true) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.get();
  return useQuery(searchGenres(sectionId, library, query, enabled));
};

export const searchPlaylists = (library: Library, query: string, limit: number, enabled: boolean) =>
  queryOptions({
    queryKey: [QueryKeys.SEARCH_PLAYLISTS, query, limit],
    queryFn: () => library.searchPlaylists(query, limit),
    enabled,
  });

export const useSearchPlaylists = (query: string, limit: number, enabled = true) => {
  const library = store.library.get();
  return useQuery(searchPlaylists(library, query, limit, enabled));
};

export const searchTracks = (
  sectionId: number,
  library: Library,
  query: string,
  limit: number,
  enabled: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.SEARCH_TRACKS, query, limit],
    queryFn: () => library.searchTracks(sectionId, query, limit),
    enabled,
  });

export const useSearchTracks = (query: string, limit: number, enabled = true) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.get();
  return useQuery(searchTracks(sectionId, library, query, limit, enabled));
};
