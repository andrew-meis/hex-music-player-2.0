export interface AlbumLoaderData {
  guid: string;
  id: number;
  parentGuid: string;
  parentId: string;
  parentTitle: string;
  title: string;
}

export interface AlbumsLoaderData {
  section: string;
}

export interface ArtistLoaderData {
  guid: string;
  id: number;
  title: string;
}

export interface ArtistDiscographyLoaderData {
  guid: string;
  id: number;
  title: string;
}

export interface ArtistsLoaderData {
  section: string;
}

export interface ChartsLoaderData {
  start: number;
  end: number;
}

export interface CollectionLoaderData {
  id: number;
  title: string;
}

export interface CollectionsLoaderData {
  section: string;
}

export interface GenreLoaderData {
  id: number;
  title: string;
}

export interface GenresLoaderData {
  section: string;
}

export interface NowPlayingLoaderData {
  tab: string;
}

export interface PlaylistLoaderData {
  id: number;
  title: string;
}

export interface PlaylistsLoaderData {
  section: string;
}

export interface SearchLoaderData {
  filter: string;
  query: string;
}

export interface TrackLoaderData {
  grandparentGuid: string;
  grandparentId: string;
  grandparentTitle: string;
  id: number;
  parentGuid: string;
  parentId: string;
  parentTitle: string;
  title: string;
}

export interface TracksLoaderData {
  section: string;
}
