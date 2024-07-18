import { useQuery } from '@tanstack/react-query';
import { Track } from 'api';
import { db, Lyrics } from 'features/db';
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

const createLRClibUrl = (artist: string, album: string, track: string, duration: string) => {
  const url = 'https://lrclib.net/api/get';
  const params = new URLSearchParams();
  params.append('artist_name', artist);
  params.append('album_name', album);
  params.append('track_name', track);
  params.append('duration', duration);
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
    try {
      const url = createLRClibUrl(
        track.grandparentTitle?.toLowerCase() || ' ',
        track.parentTitle?.toLowerCase() || ' ',
        track.title?.toLowerCase() || ' ',
        Math.floor((track.duration || 0) / 1000).toString()
      );
      const response = await ky(url).json<LRCLibResponse>();
      const lyrics: Lyrics = {
        albumGuid: track.parentGuid,
        artistGuid: track.grandparentGuid,
        trackGuid: track.guid,
        albumTitle: track.parentTitle,
        artistTitle:
          track.grandparentTitle === 'Various Artists'
            ? track.originalTitle
            : track.grandparentTitle,
        trackTitle: track.title,
        instrumental: response.instrumental,
        plainLyrics: response.plainLyrics,
        syncedLyrics: response.syncedLyrics,
      };
      if (savedLyrics) {
        await db.lyrics.update(savedLyrics.id, lyrics);
      } else {
        await db.lyrics.add(lyrics);
      }
      return lyrics;
    } catch {
      try {
        const url = createLRClibUrl(
          track.originalTitle?.toLowerCase() || ' ',
          track.parentTitle?.toLowerCase() || ' ',
          track.title?.toLowerCase() || ' ',
          Math.floor((track.duration || 0) / 1000).toString()
        );
        const response = await ky(url).json<LRCLibResponse>();
        const lyrics: Lyrics = {
          albumGuid: track.parentGuid,
          artistGuid: track.grandparentGuid,
          trackGuid: track.guid,
          albumTitle: track.parentTitle,
          artistTitle:
            track.grandparentTitle === 'Various Artists'
              ? track.originalTitle
              : track.grandparentTitle,
          trackTitle: track.title,
          instrumental: response.instrumental,
          plainLyrics: response.plainLyrics,
          syncedLyrics: response.syncedLyrics,
        };
        if (savedLyrics) {
          await db.lyrics.update(savedLyrics.id, lyrics);
        } else {
          await db.lyrics.add(lyrics);
        }
        return lyrics;
      } catch {
        const lyrics: Lyrics = {
          albumGuid: track.parentGuid,
          artistGuid: track.grandparentGuid,
          trackGuid: track.guid,
          albumTitle: track.parentTitle,
          artistTitle:
            track.grandparentTitle === 'Various Artists'
              ? track.originalTitle
              : track.grandparentTitle,
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
      }
    }
  },
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  retry: false,
  staleTime: Infinity,
});

export const useLyrics = (track: Track) => useQuery(lyricsQuery(track));
