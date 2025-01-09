export interface PersistedStore {
  audio: {
    savedTimeMillis: number;
    volume: number;
  };
  lastfmApiKey: string;
  lyricsSize: number;
  queueId: number;
  recentSearches: string[];
}
