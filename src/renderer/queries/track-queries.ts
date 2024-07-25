import { keepPreviousData, QueryClient, queryOptions, useQuery } from '@tanstack/react-query';
import { Library, parseTrackContainer, SORT_BY_DATE_PLAYED, Track } from 'api';
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

const recentTracksQuery = (ids: number[], days: number, stringFilter: string, enabled: boolean) =>
  queryOptions({
    queryKey: [QueryKeys.RECENT_TRACKS, ids.join(), days],
    queryFn: async () => {
      const { sectionId } = store.serverConfig.peek();
      const library = store.library.peek();
      const time = DateTime.now();
      const promises = ids.map((id) => {
        const url = library.server.getAuthenticatedUrl(
          '/status/sessions/history/all',
          new URLSearchParams({
            sort: SORT_BY_DATE_PLAYED.desc,
            librarySectionID: sectionId.toString(),
            metadataItemID: id.toString(),
            'viewedAt<': time.toUnixInteger().toString(),
            'viewedAt>': time.minus({ days }).toUnixInteger().toString(),
          })
        );
        return ky(url).json() as Promise<Record<string, any>>;
      });
      const response = await Promise.all(promises);
      const entries: Track[] = [];
      response.forEach((obj) => {
        if (obj.MediaContainer.size > 0) {
          entries.push(...obj.MediaContainer.Metadata);
        }
      });
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
        const appearanceTracks = tracks.filter(
          (track) =>
            track.originalTitle?.toLowerCase().includes(stringFilter.toLowerCase()) &&
            track.grandparentId !== ids[0]
        );
        const artistTracks = tracks.filter((track) => track.grandparentId === ids[0]);
        return [...appearanceTracks, ...artistTracks].sort(
          (a, b) => b.globalViewCount - a.globalViewCount
        );
      }
      return [];
    },
    placeholderData: keepPreviousData,
    enabled,
  });

export const useRecentTracks = (ids: number[], days: number, stringFilter = '', enabled = true) =>
  useQuery(recentTracksQuery(ids, days, stringFilter, enabled));

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
  enabled: boolean,
  guid: string,
  id: number,
  library: Library,
  sectionId: number,
  sort: string,
  title: string,
  removeDupes?: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.TRACKS_BY_ARTIST, id, sort],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('push', '1');
      searchParams.append('artist.id', id.toString());
      searchParams.append('or', '1');
      searchParams.append('track.title', title);
      searchParams.append('or', '1');
      searchParams.append('track.artist', title);
      searchParams.append('pop', '1');
      if (removeDupes) searchParams.append('group', 'guid');
      searchParams.append('sort', sort);
      const { tracks } = await library.tracks(sectionId, searchParams);
      const filteredTracks = tracks.filter(
        (track) =>
          track.originalTitle?.toLowerCase().includes(title.toLowerCase()) ||
          track.grandparentId === id
      );
      const releaseFilters = await window.api.getValue('release-filters');
      if (!releaseFilters) return filteredTracks;
      const [isFiltered] = releaseFilters.filter((filter) => filter.guid === guid);
      if (isFiltered) {
        return filteredTracks.filter((track) => !isFiltered.exclusions.includes(track.parentGuid));
      }
      return filteredTracks;
    },
    placeholderData: keepPreviousData,
    enabled,
  });

export const useTracksByArtist = (
  guid: string,
  id: number,
  sort: string,
  title: string,
  enabled = true,
  removeDupes?: boolean
) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(
    tracksByArtistQuery(enabled, guid, id, library, sectionId, sort, title, removeDupes)
  );
};

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

export const useTracks = (searchParams?: URLSearchParams, enabled = true) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(tracksQuery(sectionId, library, enabled, searchParams));
};
