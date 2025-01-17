import { QueryClient, queryOptions, useQuery } from '@tanstack/react-query';
import { AlbumContainer, ArtistContainer, Library, parseContainerType } from 'api';
import { deburr, uniqBy } from 'lodash';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { ArtistKeys, QueryKeys } from 'typescript';

export const invalidateArtistQueries = async (queryClient: QueryClient) =>
  await queryClient.invalidateQueries({
    predicate: (query) => Object.values(ArtistKeys).includes(query.queryKey[0] as ArtistKeys),
  });

export const artistQuery = (id: number, library: Library) =>
  queryOptions({
    queryKey: [QueryKeys.ARTIST, id],
    queryFn: async () => {
      const {
        artists: [artist],
      } = await library.artist(id, {
        includeChildren: true,
        includePopularLeaves: true,
        includeRelated: true,
        includeRelatedCount: 5,
      });
      const hubsToFetch = artist.hubs
        .filter((hub) => hub.more)
        .filter((hub) => hub.hubIdentifier !== 'external.artist.similar.sonically');
      for (const hubToFetch of hubsToFetch) {
        const response = await library.fetch(hubToFetch.key);
        const container = parseContainerType(hubToFetch.type === 'artist' ? 8 : 9, response);
        const items =
          container._type === 'artistContainer'
            ? (container as ArtistContainer).artists
            : (container as AlbumContainer).albums;
        artist.hubs.find((hub) => hub.hubIdentifier === hubToFetch.hubIdentifier)!.items = items;
      }
      return artist;
    },
  });

export const useArtist = (id: number) => {
  const library = store.library.peek();
  return useQuery(artistQuery(id, library));
};

export const artistsQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.ARTISTS, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.artists(sectionId, searchParams),
});

export const useArtists = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(artistsQuery(sectionId, library, searchParams));
};

export const trackArtistsQuery = (
  sectionId: number,
  library: Library,
  trackId: number,
  artistTitle: string
) => ({
  queryKey: [QueryKeys.TRACK_ARTISTS, trackId],
  queryFn: async () => {
    // other potential separators: med
    const regex =
      /\s([Ff]t\.?|[Ff]eaturing|[Ff]eat\.?|[Ww]ith|[Aa]nd|[Xx]|[Oo]f|[Dd]uet with|[Vv]s\.?|&|\+|w\/|×)\s|,\s|\/\s|·\s/gm;
    const separators = [
      'feat.',
      'feat',
      'featuring',
      'ft.',
      'ft',
      'duet with',
      'and',
      'x',
      'of',
      '&',
      ',',
      'with',
      '',
      'w/',
      'vs.',
      'vs',
      '+',
      '×',
      '·',
    ];
    const artistTitleSplit = artistTitle
      .split(regex)
      .filter((str) => str !== undefined)
      .map((str) => str.trim());
    const andIndexes = artistTitleSplit.flatMap((str, i) => (str.toLowerCase() === 'and' ? i : []));
    const ampersandIndexes = artistTitleSplit.flatMap((str, i) => (str === '&' ? i : []));
    if (andIndexes) {
      const newNames = andIndexes.map((n) => artistTitleSplit.slice(n - 1, n + 2).join(' '));
      artistTitleSplit.push(...newNames);
    }
    if (ampersandIndexes) {
      const newNames = ampersandIndexes.map((n) => artistTitleSplit.slice(n - 1, n + 2).join(' '));
      artistTitleSplit.push(...newNames);
    }
    const searchArray = artistTitleSplit
      .filter((str) => !separators.includes(str.toLowerCase()))
      .map((str) => str.toLowerCase());
    const promises = searchArray.map((str) =>
      library.artists(
        sectionId,
        new URLSearchParams({
          title: deburr(str),
          limit: '5',
        })
      )
    );
    const artists = await Promise.all(promises);
    return uniqBy(
      artists.flatMap((container) => {
        if (container.totalSize === 0) return [];
        const match = container.artists.filter((artist) =>
          searchArray.includes(artist.title.toLowerCase())
        );
        if (match.length === 0) return [];
        if (match.length === 1) return match[0];
        return [];
      }),
      'title'
    ).map((artist, index) => {
      if (index === 0) return { ...artist, type: 'Main artist ' };
      return { ...artist, type: 'Guest artist ' };
    });
  },
});

export const useTrackArtists = (trackId: number, artistTitle: string) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(trackArtistsQuery(sectionId, library, trackId, artistTitle));
};
