import Fuse from 'fuse.js';
import { DateTime } from 'luxon';

import { SORT_BY_DATE_PLAYED } from './index';
import ServerConnection from './server-connection';
import { Album, AlbumContainer, parseAlbumContainer } from './types/album';
import { Artist, ArtistContainer, parseArtistContainer } from './types/artist';
import { Collection, CollectionContainer, parseCollectionContainer } from './types/collection';
import { parseCountryArray } from './types/country';
import { parseDecadeArray } from './types/decade';
import { Device } from './types/device';
import { parseFormatArray } from './types/format';
import { parseGenreContainer } from './types/genre';
import { parseHistoryContainer } from './types/history';
import { parseHubContainer } from './types/hub';
import { parseMoodArray } from './types/mood';
import { parsePlayQueue } from './types/play-queue';
import {
  parsePlaylist,
  parsePlaylistContainer,
  Playlist,
  PlaylistContainer,
} from './types/playlist';
import { parseSection, parseSectionContainer } from './types/section';
import { parseStudioArray } from './types/studio';
import { parseStyleArray } from './types/style';
import { parseSubformatArray } from './types/subformat';
import { parseTrackContainer, Track, TrackContainer } from './types/track';
import { parseYearArray } from './types/year';
import { withContainerParams, withParams } from './utils/params';
import { RequestOptions } from './utils/request';

export enum MediaType {
  ARTIST = 8,
  ALBUM = 9,
  TRACK = 10,
  PLAYLIST = 15,
  COLLECTION = 18,
}

/**
 * Parse a plex response based on the data type
 */

type ContainerReturnType<T> = T extends MediaType.ARTIST
  ? ArtistContainer
  : T extends MediaType.ALBUM
    ? AlbumContainer
    : T extends MediaType.TRACK
      ? TrackContainer
      : T extends MediaType.PLAYLIST
        ? PlaylistContainer
        : T extends MediaType.COLLECTION
          ? CollectionContainer
          : never;

export function parseContainerType<T extends MediaType>(
  type: T,
  data: Record<string, any>
): ContainerReturnType<T> {
  switch (type) {
    case MediaType.ARTIST:
      return parseArtistContainer(data) as ContainerReturnType<T>;
    case MediaType.ALBUM:
      return parseAlbumContainer(data) as ContainerReturnType<T>;
    case MediaType.TRACK:
      return parseTrackContainer(data) as ContainerReturnType<T>;
    case MediaType.PLAYLIST:
      return parsePlaylistContainer(data) as ContainerReturnType<T>;
    case MediaType.COLLECTION:
      return parseCollectionContainer(data) as ContainerReturnType<T>;
    default:
      throw new Error(`Unknown MediaType: ${type}`);
  }
}

type ReturnType<T> = T extends MediaType.ARTIST
  ? Artist
  : T extends MediaType.ALBUM
    ? Album
    : T extends MediaType.TRACK
      ? Track
      : T extends MediaType.PLAYLIST
        ? Playlist
        : T extends MediaType.COLLECTION
          ? Collection
          : never;

export function getItems<T extends MediaType>(
  type: T,
  container: ContainerReturnType<T>
): ReturnType<T>[] {
  switch (type) {
    case MediaType.ARTIST:
      return (container as ArtistContainer).artists as ReturnType<T>[];
    case MediaType.ALBUM:
      return (container as AlbumContainer).albums as ReturnType<T>[];
    case MediaType.TRACK:
      return (container as TrackContainer).tracks as ReturnType<T>[];
    case MediaType.PLAYLIST:
      return (container as PlaylistContainer).playlists as ReturnType<T>[];
    case MediaType.COLLECTION:
      return (container as CollectionContainer).collections as ReturnType<T>[];
    default:
      throw new Error(`Unknown MediaType: ${type}`);
  }
}

/**
 * Interact with a plex server
 */

export default class Library {
  public device: Device;
  public server: ServerConnection;

  constructor(serverConnection: ServerConnection, device: Device) {
    this.device = device;
    this.server = serverConnection;
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  /**
   * Query the API for a limited set of results. By default Plex will return
   * everything that matches, which in most cases can be far too much data.
   */

  async fetch(url: string, options: RequestOptions = {}) {
    const response = await this.server.fetch(url, {
      ...options,
      searchParams: withContainerParams(options.searchParams),
    });
    return response;
  }

  // ==========================================================================
  // LIBRARY
  // ==========================================================================

  /**
   * Get the status of all connected clients
   */

  async sessions() {
    const response = await this.fetch('/status/sessions');
    return response;
  }

  /**
   * Get all available sections in the library
   */

  async sections() {
    const response = await this.fetch('/library/sections');
    return parseSectionContainer(response);
  }

  /**
   * Get a specific section in the library
   */

  async section(sectionId: number) {
    const response = await this.fetch(`/library/sections/${sectionId}`);
    return parseSection(response);
  }

  /**
   * Get item history
   */

  async history(id: number, sectionId: number) {
    const path = '/status/sessions/history/all';
    const response = await this.fetch(path, {
      searchParams: new URLSearchParams({
        sort: SORT_BY_DATE_PLAYED.desc,
        librarySectionID: sectionId.toString(),
        metadataItemID: id.toString(),
      }),
    });
    return parseHistoryContainer(response);
  }

  /**
   * Get all items in a section
   */

  async sectionItems<T extends MediaType>(
    sectionId: number,
    type: T,
    searchParams: URLSearchParams = new URLSearchParams()
  ): Promise<ContainerReturnType<T>> {
    const path = `/library/sections/${sectionId}/all`;
    searchParams.append('type', type.toString());
    const response = await this.fetch(path, {
      searchParams,
    });
    return parseContainerType<T>(type, response) as ContainerReturnType<T>;
  }

  /**
   * Get all items in a section
   */

  async topItems<T extends MediaType>(
    sectionId: number,
    type: T,
    start: DateTime,
    end: DateTime,
    limit: number,
    searchParams: URLSearchParams = new URLSearchParams()
  ): Promise<ContainerReturnType<T>> {
    const path = '/library/all/top';
    searchParams.append('type', type.toString());
    searchParams.append('librarySectionID', sectionId.toString());
    searchParams.append('viewedAt>', start.toUnixInteger().toString());
    searchParams.append('viewedAt<', end.toUnixInteger().toString());
    searchParams.append('limit', limit.toString());
    const response = await this.fetch(path, { searchParams });
    return parseContainerType<T>(type, response) as ContainerReturnType<T>;
  }

  /**
   * Build library URI for use in creating queues and playlists
   */

  buildLibraryURI(
    uuid: string,
    path: string,
    searchParams: URLSearchParams = new URLSearchParams()
  ) {
    const uri = withParams(path, searchParams);
    const encodedURI = encodeURIComponent(uri);
    return `library://${uuid}/directory/${encodedURI}`;
  }

  /**
   * Fetch a metadata item
   */

  async metadata<T extends MediaType>(
    id: number,
    type: T,
    searchParams: URLSearchParams = new URLSearchParams()
  ): Promise<ContainerReturnType<T>> {
    const path = `/library/metadata/${id}`;
    const response = await this.fetch(path, { searchParams });
    return parseContainerType<T>(type, response);
  }

  // ==========================================================================
  // ADDITIONAL METADATA PATHS
  // ==========================================================================

  async metadataChildren<T extends MediaType>(
    id: number,
    type: T,
    searchParams: URLSearchParams = new URLSearchParams()
  ): Promise<ContainerReturnType<T>> {
    const path = `/library/metadata/${id}/children`;
    const response = await this.fetch(path, { searchParams });
    return parseContainerType<T>(type, response);
  }

  async metadataNearest<T extends MediaType>(
    id: number,
    type: T,
    searchParams: URLSearchParams = new URLSearchParams()
  ): Promise<ContainerReturnType<T>> {
    const path = `/library/metadata/${id}/nearest`;
    const response = await this.fetch(path, { searchParams });
    return parseContainerType<T>(type, response);
  }

  async metadataSimilar<T extends MediaType>(
    id: number,
    type: T,
    searchParams: URLSearchParams = new URLSearchParams()
  ): Promise<ContainerReturnType<T>> {
    const path = `/library/metadata/${id}/similar`;
    const response = await this.fetch(path, { searchParams });
    return parseContainerType<T>(type, response);
  }

  async refreshMetadata(id: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const path = `/library/metadata/${id}/refresh`;
    await this.fetch(path, { method: 'PUT', ...searchParams });
  }

  async unmatch(id: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const path = `/library/metadata/${id}/unmatch`;
    await this.fetch(path, { method: 'PUT', ...searchParams });
  }

  // ==========================================================================
  // COUNTRIES
  // ==========================================================================

  async countries(sectionId: number) {
    const path = `/library/sections/${sectionId}/country`;
    const response = await this.fetch(path);
    return parseCountryArray(response);
  }

  // ==========================================================================
  // GENRES
  // ==========================================================================

  async genres(
    sectionId: number,
    type: MediaType,
    searchParams: URLSearchParams = new URLSearchParams()
  ) {
    const path = `/library/sections/${sectionId}/genre`;
    searchParams.append('type', type.toString());
    const response = await this.fetch(path, { searchParams });
    return parseGenreContainer(response);
  }

  // ==========================================================================
  // STYLES
  // ==========================================================================

  async styles(sectionId: number, type: MediaType) {
    const path = `/library/sections/${sectionId}/style`;
    const searchParams = new URLSearchParams({
      type: type.toString(),
    });
    const response = await this.fetch(path, { searchParams });
    return parseStyleArray(response);
  }

  // ==========================================================================
  // MOODS
  // ==========================================================================

  async moods(sectionId: number, type: MediaType) {
    const path = `/library/sections/${sectionId}/mood`;
    const searchParams = new URLSearchParams({
      type: type.toString(),
    });
    const response = await this.fetch(path, { searchParams });
    return parseMoodArray(response);
  }

  // ==========================================================================
  // DECADES
  // ==========================================================================

  async decades(sectionId: number, type: MediaType) {
    const path = `/library/sections/${sectionId}/decade`;
    const searchParams = new URLSearchParams({
      type: type.toString(),
    });
    const response = await this.fetch(path, { searchParams });
    return parseDecadeArray(response);
  }

  // ==========================================================================
  // YEARS
  // ==========================================================================

  async years(sectionId: number, type: MediaType) {
    const path = `/library/sections/${sectionId}/year`;
    const searchParams = new URLSearchParams({
      type: type.toString(),
    });
    const response = await this.fetch(path, { searchParams });
    return parseYearArray(response);
  }

  // ==========================================================================
  // FORMATS
  // ==========================================================================

  async formats(sectionId: number, type: MediaType) {
    const path = `/library/sections/${sectionId}/format`;
    const searchParams = new URLSearchParams({
      type: type.toString(),
    });
    const response = await this.fetch(path, { searchParams });
    return parseFormatArray(response);
  }

  // ==========================================================================
  // SUBFORMATS
  // ==========================================================================

  async subformats(sectionId: number, type: MediaType) {
    const path = `/library/sections/${sectionId}/subformat`;
    const searchParams = new URLSearchParams({
      type: type.toString(),
    });
    const response = await this.fetch(path, { searchParams });
    return parseSubformatArray(response);
  }

  // ==========================================================================
  // STUDIOS
  // ==========================================================================

  async studios(sectionId: number, type: MediaType) {
    const path = `/library/sections/${sectionId}/studio`;
    const searchParams = new URLSearchParams({
      type: type.toString(),
    });
    const response = await this.fetch(path, { searchParams });
    return parseStudioArray(response);
  }

  // ==========================================================================
  // COLLECTIONS
  // ==========================================================================

  /**
   * Query all the collections in the library
   */

  async collections(sectionId: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const collections = await this.sectionItems(sectionId, MediaType.COLLECTION, searchParams);
    return collections;
  }

  // ==========================================================================
  // TRACKS
  // ==========================================================================

  /**
   * Query all the tracks in the library
   */

  async tracks(sectionId: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const tracks = await this.sectionItems(sectionId, MediaType.TRACK, searchParams);
    return tracks;
  }

  /**
   * Get information about a single track
   */

  async track(trackId: number) {
    const track = await this.metadata(trackId, MediaType.TRACK);
    return track;
  }

  // ==========================================================================
  // ALBUMS
  // ==========================================================================

  /**
   * Query all albums in the library
   */

  async albums(sectionId: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const albums = await this.sectionItems(sectionId, MediaType.ALBUM, searchParams);
    return albums;
  }

  /**
   * Get information about a single album
   */

  async album(albumId: number) {
    const album = await this.metadata(albumId, MediaType.ALBUM);
    return album;
  }

  /**
   * Get the tracks related to an album
   */

  async albumTracks(albumId: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const albumTracks = await this.metadataChildren(albumId, MediaType.TRACK, searchParams);
    return albumTracks;
  }

  // ==========================================================================
  // ARTISTS
  // ==========================================================================

  /**
   * Query all artists in the library
   */

  async artists(sectionId: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const artists = await this.sectionItems(sectionId, MediaType.ARTIST, searchParams);
    return artists;
  }

  /**
   * Get information about a single artist
   */

  async artist(
    artistId: number,
    options: {
      includeChildren?: boolean;
      includePopularLeaves?: boolean;
      includeRelated?: boolean;
      includeRelatedCount?: number;
    } = {}
  ) {
    const {
      includeChildren = false,
      includePopularLeaves = false,
      includeRelated = false,
      includeRelatedCount = 20,
    } = options;
    const artist = await this.metadata(
      artistId,
      MediaType.ARTIST,
      new URLSearchParams({
        includeChildren: includeChildren ? '1' : '0',
        includePopularLeaves: includePopularLeaves ? '1' : '0',
        includeRelated: includeRelated ? '1' : '0',
        includeRelatedCount: includeRelated ? includeRelatedCount.toString() : '0',
      })
    );
    return artist;
  }

  /**
   * Get the albums related to an artist
   */

  async artistAlbums(artistId: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const artistAlbums = await this.metadataChildren(artistId, MediaType.ALBUM, searchParams);
    return artistAlbums;
  }

  // ==========================================================================
  // PLAYLISTS
  // ==========================================================================

  async createSmartPlaylist(title: string, uri: string) {
    const response = await this.fetch('/playlists', {
      method: 'POST',
      searchParams: new URLSearchParams({
        type: 'audio',
        title,
        smart: '1',
        uri,
      }),
    });
    return parsePlaylistContainer(response);
  }

  /**
   * Fetch all playlists on the server
   */

  async playlists(searchParams: URLSearchParams = new URLSearchParams()) {
    const path = '/playlists/all';
    searchParams.append('type', MediaType.PLAYLIST.toString());
    searchParams.append('playlistType', 'audio');
    const response = await this.fetch(path, { searchParams });
    return parsePlaylistContainer(response);
  }

  /**
   * Fetch information about one playlist
   */

  async playlist(id: number) {
    const response = await this.fetch(`/playlists/${id}`);
    return parsePlaylistContainer(response);
  }

  async playlistItems(id: number, searchParams: URLSearchParams = new URLSearchParams()) {
    const path = `/playlists/${id}/items`;
    const response = await this.fetch(path, { searchParams });
    return parsePlaylist(response);
  }

  async editPlaylistDetails(
    playlistId: number,
    searchParams: URLSearchParams = new URLSearchParams()
  ) {
    const response = await this.fetch(`/library/metadata/${playlistId}`, {
      method: 'PUT',
      searchParams,
    });
    return response;
  }

  async editPlaylistTitle(playlistId: number, title: string) {
    const response = await this.editPlaylistDetails(playlistId, new URLSearchParams({ title }));
    return response;
  }

  async editPlaylistSummary(playlistId: number, summary: string) {
    const response = await this.editPlaylistDetails(playlistId, new URLSearchParams({ summary }));
    return response;
  }

  async addToPlaylist(playlistId: number, uri: string) {
    const response = await this.fetch(`/playlists/${playlistId}/items`, {
      method: 'PUT',
      searchParams: new URLSearchParams({
        uri,
      }),
    });
    return response;
  }

  async movePlaylistItem(playlistId: number, itemId: number, afterId: number) {
    const response = await this.fetch(`/playlists/${playlistId}/items/${itemId}/move`, {
      method: 'PUT',
      searchParams: new URLSearchParams({
        after: afterId.toString(),
      }),
    });
    return parsePlaylistContainer(response);
  }

  async deletePlaylist(playlistId: number) {
    const response = await this.fetch(`/playlists/${playlistId}`, {
      method: 'DELETE',
    });
    return response;
  }

  /**
   * Remove an item from a playlist
   */

  async removeFromPlaylist(playlistId: number, itemId: number) {
    const response = await this.fetch(`/playlists/${playlistId}/items/${itemId}`, {
      method: 'DELETE',
    });
    return response;
  }

  // ==========================================================================
  // SEARCH
  // ==========================================================================

  async searchAll(query: string, limit = 3) {
    const response = await this.fetch('/hubs/search', {
      searchParams: new URLSearchParams({
        includeCollections: '1',
        query,
        limit: limit.toString(),
      }),
    });
    return parseHubContainer(response);
  }

  /**
   * Search the library for albums matching a query
   */

  async searchAlbums(sectionId: number, query: string, limit = 5) {
    const fuseOptions = {
      keys: [{ name: 'title', weight: 3 }, 'parentTitle'],
    };
    const params = new URLSearchParams();
    params.append('type', '9');
    params.append('push', '1');
    params.append('artist.title', query);
    params.append('or', '1');
    params.append('album.title', query);
    params.append('pop', '1');
    params.append('limit', limit.toString());
    const response = await this.fetch(`/library/sections/${sectionId}/search`, {
      searchParams: params,
    });
    const albumContainer = parseAlbumContainer(response);
    const fuse = new Fuse(albumContainer.albums, fuseOptions);
    return fuse.search(query).map((value) => value.item);
  }

  /**
   * Search the library for artists matching a query
   */

  async searchArtists(sectionId: number, query: string, limit = 5) {
    const fuseOptions = {
      keys: ['title'],
    };
    const params = new URLSearchParams();
    params.append('type', '8');
    params.append('artist.title', query);
    params.append('limit', limit.toString());
    const response = await this.fetch(`/library/sections/${sectionId}/search`, {
      searchParams: params,
    });
    const artistContainer = parseArtistContainer(response);
    const fuse = new Fuse(artistContainer.artists, fuseOptions);
    return fuse.search(query).map((value) => value.item);
  }

  /**
   * Search the library for collections matching a query
   */

  async searchCollections(sectionId: number, query: string, limit = 5) {
    const fuseOptions = {
      keys: ['title'],
    };
    const params = new URLSearchParams();
    params.append('type', '18');
    params.append('title', query);
    params.append('limit', limit.toString());
    const response = await this.fetch(`/library/sections/${sectionId}/search`, {
      searchParams: params,
    });
    const collectionContainer = parseCollectionContainer(response);
    const fuse = new Fuse(collectionContainer.collections, fuseOptions);
    return fuse.search(query).map((value) => value.item);
  }

  /**
   * Search the library for genres matching a query
   */

  async searchGenres(sectionId: number, query: string) {
    const response = await this.genres(sectionId, 10);
    return response.genres.filter((value) =>
      value.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Search the library for artists matching a query
   */

  async searchPlaylists(query: string, limit = 5) {
    const fuseOptions = {
      keys: ['title'],
    };
    const params = new URLSearchParams();
    params.append('type', '15');
    params.append('playlistType', 'audio');
    params.append('title', query);
    params.append('limit', limit.toString());
    const response = await this.fetch('/playlists/all', {
      searchParams: params,
    });
    const playlistContainer = parsePlaylistContainer(response);
    const fuse = new Fuse(playlistContainer.playlists, fuseOptions);
    return fuse.search(query).map((value) => value.item);
  }

  /**
   * Search the library for tracks matching a query
   */

  async searchTracks(sectionId: number, query: string, limit = 5) {
    const fuseOptions = {
      keys: [{ name: 'title', weight: 3 }, 'parentTitle', 'grandparentTitle', 'originalTitle'],
    };
    const params = new URLSearchParams();
    params.append('type', '10');
    params.append('push', '1');
    params.append('artist.title', query);
    params.append('or', '1');
    params.append('album.title', query);
    params.append('or', '1');
    params.append('track.title', query);
    params.append('pop', '1');
    params.append('limit', limit.toString());
    const response = await this.fetch(`/library/sections/${sectionId}/search`, {
      searchParams: params,
    });
    const trackContainer = parseTrackContainer(response);
    const fuse = new Fuse(trackContainer.tracks, fuseOptions);
    return fuse.search(query).map((value) => value.item);
  }

  // ==========================================================================
  // PHOTOS
  // ==========================================================================

  /**
   * Resize a photo to a specific size
   */

  resizeImage(searchParams: URLSearchParams = new URLSearchParams()): string | undefined {
    const url = searchParams.get('url');
    if (!url || url === 'undefined') {
      return undefined;
    }
    searchParams.append('minSize', '1');
    return this.server.getAuthenticatedUrl('/photo/:/transcode', searchParams);
  }

  // ==========================================================================
  // TRACKS
  // ==========================================================================

  trackLyrics(track: Track) {
    const { streams } = track.media[0].parts[0];
    const lyricStream = streams.find((stream) => stream.format === 'txt');
    if (lyricStream == null) {
      return null;
    }
    return this.server.getAuthenticatedUrl(lyricStream.key);
  }

  // ==========================================================================
  // RATINGS
  // ==========================================================================

  /**
   * Set the user rating for a track
   */

  async rate(trackId: number, rating: number) {
    const response = await this.fetch('/:/rate', {
      method: 'PUT',
      searchParams: new URLSearchParams({
        key: trackId.toString(),
        identifier: 'com.plexapp.plugins.library',
        rating: rating.toString(),
      }),
    });
    return response;
  }

  // ==========================================================================
  // QUEUE
  // ==========================================================================

  /**
   * Create a play queue from a uri
   *
   * @param {Object} options
   * @param {string} [options.uri] - the URI of the list. For an album, this would be the `album.key` property.
   * @param {number} [options.playlistId] - if you are using a playlist as the source, set this instead of `uri`
   * @param {string} [options.key] - URI of the track to play first
   * @param {boolean} [options.shuffle]
   * @param {boolean} [options.repeat]
   * @param {boolean} [options.includeChapters]
   * @param {boolean} [options.includeRelated]
   */

  async createQueue(
    options: {
      uri?: string;
      playlistId?: number;
      key?: string;
      shuffle?: boolean;
      repeat?: boolean;
      includeChapters?: number;
      includeRelated?: number;
    } = {}
  ) {
    const response = await this.fetch('/playQueues', {
      method: 'POST',
      searchParams: new URLSearchParams({
        type: 'audio',
        ...(options.playlistId && { playlistID: options.playlistId.toString() }),
        ...(options.uri && { uri: options.uri }),
        ...(options.key && { key: options.key }),
        shuffle: options.shuffle ? '1' : '0',
        repeat: options.repeat ? '1' : '0',
        includeChapters: options.includeChapters ? '1' : '0',
        includeRelated: options.includeRelated ? '1' : '0',
      }),
    });
    return parsePlayQueue(response);
  }

  /**
   * Fetch information about an existing play queue
   */

  async playQueue(playQueueId: number, center: number | undefined, repeat: 1 | 0) {
    const response = await this.fetch(`/playQueues/${playQueueId}`, {
      searchParams: new URLSearchParams({
        window: '30',
        ...(center && { center: center.toString() }),
        repeat: repeat.toString(),
      }),
    });
    return parsePlayQueue(response);
  }

  /**
   * Move an item in the play queue to a new position
   */

  async movePlayQueueItem(playQueueId: number, itemId: number, afterId: number) {
    const response = await this.fetch(`/playQueues/${playQueueId}/items/${itemId}/move`, {
      method: 'PUT',
      searchParams: new URLSearchParams({
        after: afterId.toString(),
      }),
    });
    return parsePlayQueue(response);
  }

  /**
   * Shuffle a play queue
   */

  async shufflePlayQueue(playQueueId: number) {
    const response = await this.fetch(`/playQueues/${playQueueId}/shuffle`, {
      method: 'PUT',
    });
    return parsePlayQueue(response);
  }

  /**
   * Unshuffle a play queue
   */

  async unshufflePlayQueue(playQueueId: number) {
    const response = await this.fetch(`/playQueues/${playQueueId}/unshuffle`, {
      method: 'PUT',
    });
    return parsePlayQueue(response);
  }

  // ==========================================================================
  // TIMELINE
  // ==========================================================================

  /**
   * Update plex about the current timeline status.
   *
   * @param {Object} options
   * @param {number} options.queueItemId - id of playlist queue item
   * @param {string} options.ratingKey - uri of track metadata
   * @param {string} options.key - id of track
   * @param {string} options.playerState - playing, paused, stopped
   * @param {number} options.currentTime - current time in ms
   * @param {number} options.duration - track duration in ms
   */

  async timeline(options: {
    queueItemId: number;
    ratingKey: string;
    key: string;
    playerState: string;
    currentTime: number;
    duration: number;
  }) {
    const { currentTime, duration, queueItemId, ratingKey, key, playerState } = options;
    const response = await this.fetch('/:/timeline', {
      searchParams: new URLSearchParams({
        hasMDE: '1',
        ratingKey,
        key,
        playQueueItemID: queueItemId.toString(),
        state: playerState,
        time: currentTime.toString(),
        duration: duration.toString(),
      }),
    });
    return response;
  }

  // ==========================================================================
  // MODIFY LIST
  // ==========================================================================

  async modifyListField(
    prop: string,
    sectionId: number,
    type: MediaType,
    id: number,
    addTags: string[] = [],
    removeTags: string[] = []
  ): Promise<Record<string, unknown>> {
    const params = addTags.reduce<Record<string, string>>((obj, tag, i) => {
      obj[`${prop}[${i}].tag.tag`] = tag;
      return obj;
    }, {});

    if (removeTags.length > 0) {
      params[`${prop}[].tag.tag-`] = removeTags.map(encodeURIComponent).join(',');
    }

    const response = await this.server.fetch(`/library/sections/${sectionId}/all`, {
      method: 'PUT',
      searchParams: new URLSearchParams({
        ...params,
        type: type.toString(),
        id: id.toString(),
        [`${prop}.locked`]: '1',
      }),
    });
    return response;
  }

  /**
   * Modify the genre tags for an item
   *
   * @param {number} sectionId - library section id
   * @param {number} type - type of item to modify
   * @param {number} id - id of the item to modify
   * @param {Array} add - tags to add to the item
   * @param {Array} [remove = []] - tags to remove from the item
   */

  async modifyGenre(
    sectionId: number,
    type: MediaType,
    id: number,
    add: string[],
    remove?: string[]
  ) {
    return this.modifyListField('genre', sectionId, type, id, add, remove);
  }

  /**
   * Modify the genre tags for an album
   */

  async modifyAlbumGenre(sectionId: number, albumId: number, add: string[], remove?: string[]) {
    const response = await this.modifyGenre(sectionId, MediaType.ALBUM, albumId, add, remove);
    return response;
  }

  /**
   * Modify the genre tags for an artist
   */

  async modifyArtistGenre(sectionId: number, artistId: number, add: string[], remove?: string[]) {
    const response = await this.modifyGenre(sectionId, MediaType.ARTIST, artistId, add, remove);
    return response;
  }

  async modifyCollection(
    sectionId: number,
    type: MediaType,
    id: number,
    add: string[],
    remove?: string[]
  ) {
    return this.modifyListField('collection', sectionId, type, id, add, remove);
  }

  async modifyAlbumCollection(
    sessionId: number,
    albumId: number,
    add: string[],
    remove?: string[]
  ) {
    return this.modifyCollection(sessionId, MediaType.ALBUM, albumId, add, remove);
  }
}
