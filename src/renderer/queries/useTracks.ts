import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library, Params, parseTrackContainer, Track } from 'api';
import ky from 'ky';
import { store } from 'state';
import { QueryKeys, ServerConfig } from 'typescript';

const fuzzyTrackSearch = async ({ artist, title }: { artist: string; title: string }) => {
  const account = store.account.peek();
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
    library.api.uri +
    `/library/sections/${sectionId}` +
    `/search?${params.toString()}` +
    `&X-Plex-Token=${account.authToken}`;
  const response = (await ky(url, { headers: library.api.headers() }).json()) as Record<
    string,
    any
  >;
  return parseTrackContainer(response).tracks;
};

export const getPlexMatch = async ({ artist, title }: { artist: string; title: string }) => {
  const library = store.library.peek();
  const regex = /\s[[(](?=[Ff]eat\.|[Ww]ith\s|[Ff]t\.|[Ff]eaturing\s)|\s&\s/;
  const searchArtist = artist.split(regex)[0];
  const searchTitle = title.split(regex)[0];
  const query = `${searchArtist} ${searchTitle}`
    .split(' ')
    .filter((t) => t.length > 1)
    .join(' ');
  const searchResults: Track[] = [];
  try {
    const results = (await library.searchAll(query)).hubs.find((hub) => hub.type === 'track')
      ?.items as Track[];
    searchResults.push(...results);
  } catch {
    // pass
  }
  const searchTrackResults = await fuzzyTrackSearch({
    artist: searchArtist,
    title: searchTitle,
  });
  const matchTrack = () => {
    if (searchTrackResults && searchResults) {
      const allTracks = [...searchTrackResults, ...searchResults];
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
    }
    return undefined;
  };
  const match = matchTrack();
  return match;
};

export const tracksQuery = (config: ServerConfig, library: Library, params?: Params) =>
  queryOptions({
    queryKey: [QueryKeys.TRACKS, params],
    queryFn: async () => library.tracks(config.sectionId, params),
  });

const useTracks = (params?: Params) => {
  const config = store.serverConfig.get();
  const library = store.library.get();
  return useQuery(tracksQuery(config, library, params));
};

export default useTracks;
