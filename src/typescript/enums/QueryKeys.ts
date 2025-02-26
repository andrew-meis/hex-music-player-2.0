// return album objects
export enum AlbumKeys {
  ALBUM = 'album',
  ALBUMS = 'albums',
  ALBUMS_ARTIST_APPEARS_ON = 'albums-artist-appears-on', // uses custom filters
  SEARCH = 'search', // includes albums, artists, collections, genres, playlists, and tracks
  SEARCH_ALBUMS = 'search-albums',
}

// return artist objects
export enum ArtistKeys {
  ARTIST = 'artist',
  ARTISTS = 'artists',
  SEARCH = 'search', // includes albums, artists, collections, genres, playlists, and tracks
  SEARCH_ARTISTS = 'search-artists',
  TRACK_ARTISTS = 'track-artists'
}

// use custom filters
export enum CustomFilterKeys {
  ALBUMS_ARTIST_APPEARS_ON = 'albums-artist-appears-on', // uses custom filters
  IS_HIDDEN = 'is-hidden', // uses custom filters
  TRACKS_BY_ARTIST = 'tracks-by-artist', // uses custom filters
}

export enum LastFMQueryKeys {
  LASTFM_ARTIST = 'lastfm-artist',
  LASTFM_MATCH_TRACKS = 'lastfm-match-tracks',
  LASTFM_SEARCH = 'lastfm-search',
  LASTFM_SIMILAR = 'lastfm-similar',
  LASTFM_TAG = 'lastfm-tag',
  LASTFM_TRACK = 'lastfm-track',
}

// return track objects
export enum TrackKeys {
  ALBUM_TRACKS = 'album-tracks',
  ARTIST = 'artist', // includes popular tracks
  CHART = 'chart',
  PLAYLIST_ITEMS = 'playlist-items',
  PLAYQUEUE = 'play-queue',
  RECENT_TRACKS = 'recent-tracks',
  RELATED_TRACKS = 'related-tracks',
  SEARCH = 'search', // includes albums, artists, collections, genres, playlists, and tracks
  SEARCH_TRACKS = 'search-tracks',
  SIMILAR_TRACKS = 'similar-tracks',
  TRACK = 'track',
  TRACKS = 'tracks',
  TRACKS_BY_ARTIST = 'tracks-by-artist', // uses custom filters
}

export enum OtherQueryKeys {
  COLLECTIONS = 'collections',
  COUNTRIES = 'countries',
  GENRES = 'genres',
  HISTORY = 'history',
  LYRICS = 'lyrics',
  MOODS = 'moods',
  PALETTE = 'palette',
  PLAYLIST = 'playlist',
  PLAYLISTS = 'playlists',
  SEARCH_COLLECTIONS = 'search-collections',
  SEARCH_GENRES = 'search-genres',
  SEARCH_PLAYLISTS = 'search-playlists',
  USER = 'user',
}

export const QueryKeys = {
  ...AlbumKeys,
  ...ArtistKeys,
  ...CustomFilterKeys,
  ...LastFMQueryKeys,
  ...TrackKeys,
  ...OtherQueryKeys,
};

export type QueryKeys = typeof QueryKeys;
