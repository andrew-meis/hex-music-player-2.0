import { Album } from 'api';

export interface PersistedStore {
  appearsOnFilters: Record<
    string,
    {
      exclusions: string[];
      inclusions: string[];
    }
  >;
  audio: {
    savedTimeMillis: number;
    volume: number;
  };
  currentFavorites: Record<number, number>;
  lastfmApiKey: string;
  lyricsSize: number;
  playlistFolders: Record<string, number[]>;
  queueId: number;
  recentSearches: string[];
  sorting: {
    key: keyof Album;
    order: 'asc' | 'desc';
  };
  syncLyrics: boolean;
}
