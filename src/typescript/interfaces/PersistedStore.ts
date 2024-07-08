export interface PersistedStore {
  audio: {
    volume: number;
  };
  displayRemainingTime: boolean;
  lastfmApiKey: string;
  lyricsSize: number;
  queueId: number;
  recentSearches: string[];
}