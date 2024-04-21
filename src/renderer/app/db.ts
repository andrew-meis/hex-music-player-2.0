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

class HexMusicDexie extends Dexie {
  lyrics!: Table<Lyrics>;

  constructor() {
    super('hex-music-db');
    this.version(1).stores({
      lyrics: '++id, artistGuid, trackGuid',
    });
  }
}

export const db = new HexMusicDexie();
