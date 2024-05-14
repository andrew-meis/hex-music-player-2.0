import * as filter from './filter';

export { filter };
export { default as Account } from './account';
export { default as Client } from './client';
export { parseContainerType } from './library';
export { default as Library, MediaType } from './library';
export { default as normalize, normalizeSync } from './normalize';
export { default as ServerConnection } from './server-connection';
export type { Album, AlbumContainer } from './types/album';
export { isAlbum, parseAlbumContainer } from './types/album';
export type { Artist, ArtistContainer } from './types/artist';
export { isArtist, parseArtistContainer } from './types/artist';
export type { Collection, CollectionContainer } from './types/collection';
export { isCollection } from './types/collection';
export { parseCollectionContainer } from './types/collection';
export type { Country } from './types/country';
export type { Decade } from './types/decade';
export type { Connection, Device } from './types/device';
export type { Format } from './types/format';
export type { Genre, GenreContainer } from './types/genre';
export { isGenre, parseGenreContainer } from './types/genre';
export type { Hub, HubContainer } from './types/hub';
export { parseHubContainer } from './types/hub';
export type { Media } from './types/media';
export type { MediaContainer } from './types/media-container';
export type { Mood } from './types/mood';
export type { Part } from './types/part';
export type { Pin } from './types/pin';
export type { PlayQueue, PlayQueueItem } from './types/play-queue';
export { isPlayQueueItem, parsePlayQueue } from './types/play-queue';
export type { Playlist, PlaylistContainer, PlaylistItem } from './types/playlist';
export { isPlaylist, parsePlaylistContainer } from './types/playlist';
export type { ResourceContainer } from './types/resources';
export type { Section, SectionContainer } from './types/section';
export type { Stream } from './types/stream';
export type { Studio } from './types/studio';
export type { Style } from './types/style';
export type { Subformat } from './types/subformat';
export type { Tag } from './types/tag';
export type { Track, TrackContainer } from './types/track';
export { isTrack, parseTrackContainer } from './types/track';
export type { Profile, Service, Subscription, User, UserSubscription } from './types/user';
export type { Year } from './types/year';

const sort = (asc: string, desc = `${asc}:desc`) => ({
  asc,
  desc,
});

// sort methods
export const SORT_BY_DATE_PLAYED = sort('viewedAt');

// old, unused
export const SORT_ARTISTS_BY_TITLE = sort('titleSort');
export const SORT_ARTISTS_BY_DATE_ADDED = sort('addedAt');
export const SORT_ARTISTS_BY_DATE_PLAYED = sort('lastViewedAt');
export const SORT_ARTISTS_BY_PLAYS = sort('viewCount');

export const SORT_ALBUMS_BY_TITLE = sort('titleSort');
export const SORT_ALBUMS_BY_ALBUM_ARTIST = sort(
  'artist.titleSort,album.year',
  'artist.titleSort:desc,album.year'
);
export const SORT_ALBUMS_BY_YEAR = sort('year');
export const SORT_ALBUMS_BY_RELEASE_DATE = sort('originallyAvailableAt');
export const SORT_ALBUMS_BY_RATING = sort('userRating');
export const SORT_ALBUMS_BY_DATE_ADDED = sort('addedAt');
export const SORT_ALBUMS_BY_DATE_PLAYED = sort('lastViewedAt');
export const SORT_ALBUMS_BY_VIEWS = sort('viewCount');

export const SORT_PLAYLISTS_BY_NAME = sort('titleSort');
export const SORT_PLAYLISTS_BY_PLAYS = sort('viewCount');
export const SORT_PLAYLISTS_BY_LAST_PLAYED = sort('lastViewedAt');
export const SORT_PLAYLISTS_BY_DURATION = sort('duration');
export const SORT_PLAYLISTS_BY_DATE_ADDED = sort('addedAt');
export const SORT_PLAYLISTS_BY_ITEM_COUNT = sort('mediaCount');

export const SORT_TRACKS_BY_TITLE = sort('titleSort');
export const SORT_TRACKS_BY_ALBUM_ARTIST = sort('artist.titleSort,album.titleSort,track.index');
export const SORT_TRACKS_BY_ARTIST = sort('track.originalTitle,album.titleSort,track.index');
export const SORT_TRACKS_BY_ALBUM = sort('album.titleSort,track.index');
export const SORT_TRACKS_BY_YEAR = sort('year');
export const SORT_TRACKS_BY_RATING = sort('userRating');
export const SORT_TRACKS_BY_DURATION = sort('duration');
export const SORT_TRACKS_BY_PLAYS = sort('viewCount');
export const SORT_TRACKS_BY_DATE_ADDED = sort('addedAt');
export const SORT_TRACKS_BY_BITRATE = sort('mediaBitrate');
export const SORT_TRACKS_BY_POPULARITY = sort('ratingCount');

// playlist types
export const PLAYLIST_TYPE_MUSIC = 'audio';
export const PLAYLIST_TYPE_PHOTO = 'photo';
export const PLAYLIST_TYPE_VIDEO = 'video';
