import { keepPreviousData, QueryClient, queryOptions, useQuery } from '@tanstack/react-query';
import { HistoryEntry, Library, parseTrackContainer, SORT_BY_DATE_PLAYED, Track } from 'api';
import { sort } from 'fast-sort';
import { db } from 'features/db';
import ky from 'ky';
import { LastFMTrack } from 'lastfm-ts-api';
import { countBy, uniqBy } from 'lodash';
import { DateTime } from 'luxon';
import paramsToObject from 'scripts/params-to-object';
import { persistedStore, store } from 'state';
import { QueryKeys, TrackKeys } from 'typescript';

export const invalidateTrackQueries = async (queryClient: QueryClient) =>
  await queryClient.invalidateQueries({
    predicate: (query) => Object.values(TrackKeys).includes(query.queryKey[0] as TrackKeys),
  });

const albumTracksQuery = (id: number) =>
  queryOptions({
    queryKey: [QueryKeys.ALBUM_TRACKS, id],
    queryFn: async () => {
      const library = store.library.peek();
      const response = await library.albumTracks(id);
      return response.tracks || [];
    },
    placeholderData: keepPreviousData,
  });

export const useAlbumTracks = (id: number) => useQuery(albumTracksQuery(id));

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
      if (similartracks.track.length === 0) {
        return { reason: 'No similar tracks on last.fm.', tracks: [] };
      }
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
      if (matchedTracks.length === 0) {
        return { reason: 'No last.fm similar tracks found in Plex library.', tracks: [] };
      }
      return { reason: 'Success!', tracks: matchedTracks };
    },
    enabled,
  });

/**
 * Get last.fm similar tracks for a Plex track and return matching tracks found in Plex library.
 * @param {Track} track
 * @param {boolean} enabled
 */
export const useLastfmMatchTracks = (track: Track, enabled: boolean = true) =>
  useQuery(lastfmMatchTracksQuery(track, enabled));

const recentTracksByArtistQuery = (
  artistGuid: string,
  artistId: number,
  artistTitle: string,
  ids: number[],
  days: number | undefined,
  limit: number | undefined,
  enabled: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.RECENT_TRACKS, artistId, ids.join(), days, limit],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      let promises: Promise<Record<string, any>>[];
      if (days) {
        const time = DateTime.now();
        promises = ids.map((id) => {
          const url = library.server.getAuthenticatedUrl(
            '/status/sessions/history/all',
            new URLSearchParams({
              sort: SORT_BY_DATE_PLAYED.desc,
              librarySectionID: sectionId.toString(),
              metadataItemID: id.toString(),
              'viewedAt<': time.toUnixInteger().toString(),
              'viewedAt>': time.minus({ days }).toUnixInteger().toString(),
              ...(limit && { limit: limit.toString() }),
            })
          );
          return ky(url).json() as Promise<Record<string, any>>;
        });
      } else {
        promises = ids.map((id) => {
          const url = library.server.getAuthenticatedUrl(
            '/status/sessions/history/all',
            new URLSearchParams({
              sort: SORT_BY_DATE_PLAYED.desc,
              librarySectionID: sectionId.toString(),
              metadataItemID: id.toString(),
              ...(limit && { limit: limit.toString() }),
            })
          );
          return ky(url).json() as Promise<Record<string, any>>;
        });
      }
      const response = await Promise.all(promises);
      let entries: HistoryEntry[] = [];
      response.forEach((obj) => {
        if (obj.MediaContainer.size > 0) {
          entries.push(...obj.MediaContainer.Metadata);
        }
      });
      if (limit) {
        entries = sort(entries).desc('viewedAt').slice(0, limit);
      }
      const keys = entries.map((record) => record.ratingKey);
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
        let appearanceTracks: Track[];
        appearanceTracks = tracks.filter(
          (track) =>
            track.originalTitle?.toLowerCase().includes(artistTitle.toLowerCase()) &&
            track.grandparentId !== artistId
        );
        const artistHasFilters = persistedStore.appearsOnFilters[artistGuid].peek();
        if (artistHasFilters) {
          appearanceTracks = appearanceTracks.filter(
            (track) => !artistHasFilters.exclusions.includes(track.guid)
          );
        }
        const artistTracks = tracks.filter((track) => track.grandparentId === artistId);
        return sort([...appearanceTracks, ...artistTracks]).desc('globalViewCount');
      }
      return [];
    },
    placeholderData: keepPreviousData,
    enabled,
  });

/**
 * Get tracks played most frequently within a given number of days OR a history entry limit.
 * @param {string} artistGuid
 * @param {number} artistId
 * @param {string} artistTitle
 * @param {number[]} ids Plex ids for history query; should include the artist.id and album.id of any albums the artist appears on.
 * @param {number} days
 * @param {number} limit
 * @param {boolean} enabled
 */
export const useRecentTracksByArtist = (
  artistGuid: string,
  artistId: number,
  artistTitle: string,
  ids: number[],
  days?: number,
  limit?: number,
  enabled: boolean = true
) =>
  useQuery(recentTracksByArtistQuery(artistGuid, artistId, artistTitle, ids, days, limit, enabled));

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

export const tracksByArtistQuery = (
  artistGuid: string,
  artistId: number,
  artistTitle: string,
  sort: string,
  enabled: boolean,
  removeDupes: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.TRACKS_BY_ARTIST, artistId, sort],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      const searchParams = new URLSearchParams();
      searchParams.append('push', '1');
      searchParams.append('artist.id', artistId.toString());
      searchParams.append('or', '1');
      searchParams.append('track.title', artistTitle);
      searchParams.append('or', '1');
      searchParams.append('track.artist', artistTitle);
      searchParams.append('pop', '1');
      if (removeDupes) searchParams.append('group', 'guid');
      searchParams.append('sort', sort);
      const { tracks } = await library.tracks(sectionId, searchParams);
      const filteredTracks = tracks.filter(
        (track) =>
          track.originalTitle?.toLowerCase().includes(artistTitle.toLowerCase()) ||
          track.grandparentId === artistId
      );
      const artistHasFilters = persistedStore.appearsOnFilters[artistGuid].peek();
      if (!artistHasFilters) return filteredTracks;
      return filteredTracks.filter((track) => !artistHasFilters.exclusions.includes(track.guid));
    },
    placeholderData: keepPreviousData,
    enabled,
  });

/**
 * Get tracks by artist with Appears On tracks.
 * @param {string} artistGuid
 * @param {number} artistId
 * @param {string} artistTitle
 * @param {string} sort
 * @param {boolean} enabled
 * @param {boolean} removeDupes
 */
export const useTracksByArtist = (
  artistGuid: string,
  artistId: number,
  artistTitle: string,
  sort: string,
  enabled: boolean = true,
  removeDupes: boolean = false
) => useQuery(tracksByArtistQuery(artistGuid, artistId, artistTitle, sort, enabled, removeDupes));

export const tracksQuery = (
  sectionId: number,
  library: Library,
  enabled: boolean,
  searchParams?: URLSearchParams
) =>
  queryOptions({
    queryKey: [QueryKeys.TRACKS, paramsToObject(searchParams?.entries())],
    queryFn: async () => library.tracks(sectionId, searchParams),
    placeholderData: keepPreviousData,
    enabled,
  });

export const useTracks = (searchParams?: URLSearchParams, enabled = true) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(tracksQuery(sectionId, library, enabled, searchParams));
};
