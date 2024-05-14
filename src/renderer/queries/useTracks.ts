import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library, MediaType, parseTrackContainer, SORT_BY_DATE_PLAYED, Track } from 'api';
import { db } from 'features/db';
import ky from 'ky';
import { LastFMTrack } from 'lastfm-ts-api';
import { countBy, uniqBy } from 'lodash';
import { DateTime } from 'luxon';
import paramsToObject from 'scripts/params-to-object';
import { persistedStore, store } from 'state';
import { QueryKeys } from 'typescript';

const fuzzyTrackSearch = async ({ artist, title }: { artist: string; title: string }) => {
  const library = store.library.peek();
  const { sectionId } = store.serverConfig.peek();
  const params = new URLSearchParams();
  params.append('push', '1');
  params.append('artist.title', artist);
  if (artist.includes('’')) {
    params.append('or', '1');
    params.append('artist.title', artist.replace(/[’]/g, "'"));
    params.append('or', '1');
    params.append('artist.title', artist.replace(/[’]/g, ''));
  }
  if (artist.includes("'")) {
    params.append('or', '1');
    params.append('artist.title', artist.replace(/[']/g, '’'));
    params.append('or', '1');
    params.append('artist.title', artist.replace(/[']/g, ''));
  }
  params.append('pop', '1');
  params.append('push', '1');
  params.append('track.title', title);
  if (title.includes('’')) {
    params.append('or', '1');
    params.append('track.title', title.replace(/[’]/g, "'"));
    params.append('or', '1');
    params.append('track.title', title.replace(/[’]/g, ''));
  }
  if (title.includes("'")) {
    params.append('or', '1');
    params.append('track.title', title.replace(/[']/g, '’'));
    params.append('or', '1');
    params.append('track.title', title.replace(/[']/g, ''));
  }
  params.append('pop', '1');
  params.append('type', (10).toString());
  params.append('limit', (10).toString());
  const url =
    library.server.uri +
    `/library/sections/${sectionId}` +
    `/search?${params.toString()}` +
    `&X-Plex-Token=${library.server.account.authToken}`;
  const response = (await ky(url, { headers: library.server.headers() }).json()) as Record<
    string,
    any
  >;
  return parseTrackContainer(response).tracks;
};

const getPlexMatch = async ({
  artist,
  title,
  url,
}: {
  artist: string;
  title: string;
  url: string;
}) => {
  const library = store.library.peek();
  const savedMatch = await db.lastfmPlexMatch.where('url').equals(url).first();
  if (savedMatch) {
    if (savedMatch.matchId) {
      const match = await library.track(savedMatch.matchId);
      if (match.tracks.length > 0) {
        return match.tracks[0];
      }
    }
    if (!savedMatch.matchId) {
      return undefined;
    }
  }
  const regex = /\s[[(](?=[Ff]eat\.|[Ww]ith\s|[Ff]t\.|[Ff]eaturing\s)|\s&\s/;
  const searchArtist = artist.split(regex)[0];
  const searchTitle = title.split(regex)[0];
  const query = `${searchArtist} ${searchTitle}`
    .split(' ')
    .filter((t) => t.length > 1)
    .join(' ');
  const directSearchResults: Track[] = [];
  try {
    const results = (await library.searchAll(query)).hubs.find((hub) => hub.type === 'track')
      ?.items as Track[];
    directSearchResults.push(...results);
  } catch {
    // pass
  }
  const fuzzySearchResults: Track[] = [];
  try {
    const results = await fuzzyTrackSearch({
      artist: searchArtist,
      title: searchTitle,
    });
    fuzzySearchResults.push(...results);
  } catch {
    // pass
  }
  const findMatch = () => {
    const allTracks = [...directSearchResults, ...fuzzySearchResults];
    if (allTracks.length === 0) return undefined;
    const nameMatch = allTracks?.find((track) => {
      const lastfmTitle = title.replace(/["'’“”]/g, '').toLowerCase();
      const plexTitle = track.title.replace(/["'’“”]/g, '').toLowerCase();
      return lastfmTitle === plexTitle;
    });
    if (nameMatch) return nameMatch;
    const alphanumericMatch = allTracks?.find((track) => {
      const lastfmTitle = title.replace(/\W+/g, ' ').trim().toLowerCase();
      const plexTitle = track.title.replace(/\W+/g, ' ').trim().toLowerCase();
      return lastfmTitle === plexTitle;
    });
    if (alphanumericMatch) return alphanumericMatch;
    const partialMatch = allTracks?.find((track) => {
      const lastfmTitle = title.replace(/["'’“”]/g, '').toLowerCase();
      const plexTitle = track.title.replace(/["'’“”]/g, '').toLowerCase();
      return lastfmTitle.includes(plexTitle);
    });
    if (partialMatch) return partialMatch;
    return undefined;
  };
  const match = findMatch();
  if (savedMatch) {
    await db.lastfmPlexMatch.update(savedMatch.id!, { url, matchId: match?.id });
  } else {
    db.lastfmPlexMatch.add({
      url,
      matchId: match?.id,
    });
  }
  return match;
};

export const lastfmMatchTracksQuery = (track: Track, enabled: boolean) =>
  queryOptions({
    queryKey: [QueryKeys.LASTFM_MATCH_TRACKS, track.id],
    queryFn: async () => {
      const lastfmTrack = new LastFMTrack(persistedStore.lastfmApiKey.peek());
      const { similartracks } = await lastfmTrack.getSimilar({
        artist:
          track.grandparentTitle === 'Various Artists'
            ? track.originalTitle
            : track.grandparentTitle,
        track: track.title,
        autocorrect: 1,
      });
      if (similartracks.track.length === 0) return [];
      const matchedTracks = [] as Track[];
      await Promise.all(
        similartracks.track.map(async (track) => {
          const match = await getPlexMatch({
            artist: track.artist.name,
            title: track.name,
            url: track.url,
          });
          if (match) {
            matchedTracks.push({ ...match, score: track.match as unknown as number });
          }
        })
      );
      return matchedTracks.sort((a, b) => b.score! - a.score!);
    },
    enabled,
  });

export const useLastfmMatchTracks = (track: Track, enabled = true) =>
  useQuery(lastfmMatchTracksQuery(track, enabled));

const recentTracksQuery = (track: Track, days: number, enabled: boolean) =>
  queryOptions({
    queryKey: [QueryKeys.RECENT_TRACKS, track.id, days],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      const time = DateTime.now();
      const url = library.server.getAuthenticatedUrl(
        '/status/sessions/history/all',
        new URLSearchParams({
          sort: SORT_BY_DATE_PLAYED.desc,
          librarySectionID: sectionId.toString(),
          metadataItemID: track.grandparentId.toString(),
          'viewedAt<': time.toUnixInteger().toString(),
          'viewedAt>': time.minus({ days }).toUnixInteger().toString(),
        })
      );
      const response = (await ky(url).json()) as Record<string, any>;
      if (response.MediaContainer.size === 0) {
        return [];
      }
      const keys = response.MediaContainer.Metadata.map((record: Track) => record.ratingKey);
      const counts = countBy(keys, Math.floor);
      const { tracks } = await library.tracks(
        sectionId,
        new URLSearchParams({
          'track.id': Object.keys(counts).join(','),
        })
      );
      if (tracks.length > 0) {
        Object.keys(counts).forEach((key) => {
          const match = tracks.find((track) => track.ratingKey === key);
          if (match) match.globalViewCount = counts[key];
        });
        return tracks.sort((a, b) => b.globalViewCount - a.globalViewCount);
      }
      return [];
    },
    enabled,
  });

export const useRecentTracks = (track: Track, days: number, enabled = true) =>
  useQuery(recentTracksQuery(track, days, enabled));

const relatedTracksQuery = (track: Track, enabled: boolean) =>
  queryOptions({
    queryKey: [QueryKeys.RELATED_TRACKS, track.id],
    queryFn: () => track.getRelatedTracks(),
    enabled,
    select: (data) => {
      return uniqBy(data.tracks, 'grandparentGuid');
    },
  });

export const useRelatedTracks = (track: Track, enabled = true) =>
  useQuery(relatedTracksQuery(track, enabled));

const similarTracksQuery = (track: Track, enabled: boolean) =>
  queryOptions({
    queryKey: [QueryKeys.SIMILAR_TRACKS, track.id],
    queryFn: () => track.getSimilarTracks(),
    enabled,
  });

export const useSimilarTracks = (track: Track, enabled = true) =>
  useQuery(similarTracksQuery(track, enabled));

const topTracksQuery = (
  track: Track,
  enabled: boolean,
  start?: DateTime,
  end?: DateTime,
  days?: number
) =>
  queryOptions({
    queryKey: [QueryKeys.SIMILAR_TRACKS, track.id],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      const time = DateTime.now();
      if (days) {
        return library.topItems(sectionId, MediaType.TRACK, time.minus({ days }), time, 10);
      }
      return library.topItems(sectionId, MediaType.TRACK, start!, end!, 10);
    },
    enabled,
  });

export const useTopTracks = (
  track: Track,
  enabled = true,
  start = undefined,
  end = undefined,
  days = undefined
) => useQuery(topTracksQuery(track, enabled, start, end, days));

export const tracksQuery = (
  sectionId: number,
  library: Library,
  enabled: boolean,
  searchParams?: URLSearchParams
) =>
  queryOptions({
    queryKey: [QueryKeys.TRACKS, paramsToObject(searchParams?.entries())],
    queryFn: async () => library.tracks(sectionId, searchParams),
    enabled,
  });

const useTracks = (searchParams?: URLSearchParams, enabled = true) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(tracksQuery(sectionId, library, enabled, searchParams));
};

export default useTracks;
