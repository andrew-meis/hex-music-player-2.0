import { queryOptions, useQuery } from '@tanstack/react-query';
import { Library } from 'api';
import paramsToObject from 'scripts/params-to-object';
import { store } from 'state';
import { QueryKeys } from 'typescript';

export const artistQuery = (id: number, library: Library) =>
  queryOptions({
    queryKey: [QueryKeys.ARTIST, id],
    queryFn: async () => {
      return library.artist(id, {
        includeChildren: true,
        includePopularLeaves: true,
        includeRelated: true,
        includeRelatedCount: 20,
      });
    },
  });

export const useArtist = (id: number) => {
  const library = store.library.peek();
  return useQuery(artistQuery(id, library));
};

export const artistTracksQuery = (
  enabled: boolean,
  // TODO
  _guid: string,
  id: number,
  library: Library,
  sectionId: number,
  sort: string,
  title: string,
  removeDupes?: boolean
) =>
  queryOptions({
    queryKey: [QueryKeys.ARTIST_TRACKS, id, sort],
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
      const tracks = library.tracks(sectionId, searchParams);
      return tracks;
    },
    enabled,
  });

export const useArtistTracks = (
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
    artistTracksQuery(enabled, guid, id, library, sectionId, sort, title, removeDupes)
  );
};

export const artistsQuery = (
  sectionId: number,
  library: Library,
  searchParams?: URLSearchParams
) => ({
  queryKey: [QueryKeys.ARTISTS, paramsToObject(searchParams?.entries())],
  queryFn: async () => library.artists(sectionId, searchParams),
});

const useArtists = (searchParams?: URLSearchParams) => {
  const { sectionId } = store.serverConfig.peek();
  const library = store.library.peek();
  return useQuery(artistsQuery(sectionId, library, searchParams));
};

export default useArtists;
