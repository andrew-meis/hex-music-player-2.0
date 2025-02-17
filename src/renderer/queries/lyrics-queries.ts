import { useQuery } from '@tanstack/react-query';
import { Track } from 'api';
import { db, Lyrics } from 'features/db';
import Fuse from 'fuse.js';
import ky from 'ky';
import { QueryKeys } from 'typescript';

export interface LRCLibResponse {
  albumName: string;
  artistName: string;
  duration: number;
  id: number;
  instrumental: boolean;
  isrc: string;
  lang: string;
  name: string;
  plainLyrics: string | null;
  releaseData: string;
  spotifyId: string;
  syncedLyrics: string | null;
}

const createLRClibSearch = (artist: string, track: string) => {
  const url = 'https://lrclib.net/api/search';
  const params = new URLSearchParams();
  params.append('artist_name', artist);
  params.append('track_name', track);
  return `${url}?${params.toString()}`;
};

export const lyricsQuery = (track: Track) => ({
  queryKey: [QueryKeys.LYRICS, track.id],
  queryFn: async () => {
    const savedLyrics = await db.lyrics
      .where('artistGuid')
      .equals(track.grandparentGuid)
      .and((lyrics) => lyrics.trackGuid === track.guid)
      .first();
    const shouldRefetch =
      savedLyrics &&
      !savedLyrics.instrumental &&
      !savedLyrics.plainLyrics &&
      !savedLyrics.syncedLyrics;
    if (savedLyrics && !shouldRefetch) {
      return savedLyrics;
    }
    const artistTitle =
      track.grandparentTitle === 'Various Artists' ? track.originalTitle : track.grandparentTitle;
    const url = createLRClibSearch(artistTitle.toLowerCase(), track.title.toLowerCase());
    const response = await ky(url).json<LRCLibResponse[]>();
    const fuseOptions = {
      includeScore: true,
      keys: [
        { name: 'trackName', weight: 3 },
        { name: 'albumName', weight: 1 },
        { name: 'artistName', weight: 3 },
      ],
    };
    const fuse = new Fuse(response, fuseOptions);
    const fullSearch = fuse.search({
      trackName: track.title,
      albumName: track.parentTitle,
      artistName: artistTitle,
    });
    const [firstResult] = [
      ...fullSearch.filter((x) => x.item.syncedLyrics !== null),
      ...fullSearch.filter((x) => x.item.syncedLyrics === null),
    ];
    const partialSearch = fuse.search({
      trackName: track.title,
      artistName: artistTitle,
    });
    const [secondResult] = [
      ...partialSearch.filter((x) => x.item.syncedLyrics !== null),
      ...partialSearch.filter((x) => x.item.syncedLyrics === null),
    ];
    const preferredResult = firstResult || secondResult;
    if (preferredResult) {
      const lyrics: Lyrics = {
        albumGuid: track.parentGuid,
        artistGuid: track.grandparentGuid,
        trackGuid: track.guid,
        albumTitle: track.parentTitle,
        artistTitle: artistTitle,
        trackTitle: track.title,
        instrumental: preferredResult.item.instrumental,
        plainLyrics: preferredResult.item.plainLyrics,
        syncedLyrics: preferredResult.item.syncedLyrics,
      };
      if (savedLyrics) {
        await db.lyrics.update(savedLyrics.id, lyrics);
      } else {
        await db.lyrics.add(lyrics);
      }
      return lyrics;
    }
    const lyrics: Lyrics = {
      albumGuid: track.parentGuid,
      artistGuid: track.grandparentGuid,
      trackGuid: track.guid,
      albumTitle: track.parentTitle,
      artistTitle: artistTitle,
      trackTitle: track.title,
      instrumental: false,
      plainLyrics: null,
      syncedLyrics: null,
    };
    if (savedLyrics) {
      await db.lyrics.update(savedLyrics.id, lyrics);
    } else {
      await db.lyrics.add(lyrics);
    }
    return lyrics;
  },
  retry: false,
  staleTime: Infinity,
});

export const useLyrics = (track: Track) => useQuery(lyricsQuery(track));
