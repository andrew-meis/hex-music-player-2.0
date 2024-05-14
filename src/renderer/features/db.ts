import Dexie, { Table } from 'dexie';

export interface Lyrics {
  id?: number;
  albumGuid: string;
  artistGuid: string;
  trackGuid: string;
  albumTitle: string;
  artistTitle: string;
  trackTitle: string;
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

export interface LastfmPlexMatch {
  id?: number;
  url: string;
  matchId?: number;
}

class HexMusicDexie extends Dexie {
  lyrics!: Table<Lyrics>;
  lastfmPlexMatch!: Table<LastfmPlexMatch>;

  constructor() {
    super('hex-music-db');
    this.version(1).stores({
      lyrics: '++id, artistGuid, trackGuid',
      lastfmPlexMatch: '++id, url',
    });
  }
}

export const db = new HexMusicDexie();
