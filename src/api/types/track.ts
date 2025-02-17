import Prism from '@zwolf/prism';
import { schema } from 'normalizr';
import { store } from 'state';

import { MediaType } from '../library';
import { Field, toFieldList } from './field';
import { Media, toMedia } from './media';
import { MediaContainer, toMediaContainer } from './media-container';
import { createParser } from './parser';
import { Tag, toTagList } from './tag';
import { toDateFromSeconds, toFloat, toNumber } from './types';

const trackSchema = new schema.Entity('tracks');

const trackContainerSchema = new schema.Object({
  tracks: new schema.Array(trackSchema),
});

export interface Track {
  _type: string;
  id: number;
  parentId: number;
  grandparentId: number;

  collections: Tag[];
  fields: Field[];
  genres: Tag[];
  mbid: Tag[];
  media: Media[];
  moods: Tag[];

  addedAt: Date | undefined;
  art: string;
  deletedAt: Date | undefined;
  distance: number;
  duration: number;
  globalViewCount: number;
  grandparentArt: string;
  grandparentGuid: string;
  grandparentKey: string;
  grandparentRatingKey: string;
  grandparentThumb: string;
  grandparentTitle: string;
  guid: string;
  index: number;
  key: string;
  lastRatedAt: Date | undefined;
  lastViewedAt: Date | undefined;
  librarySectionId: number;
  librarySectionKey: string;
  librarySectionTitle: string;
  originallyAvailableAt: Date | undefined;
  originalTitle: string;
  parentGuid: string;
  parentIndex: number;
  parentKey: string;
  parentRatingKey: string;
  parentStudio: string;
  parentThumb: string;
  parentTitle: string;
  parentYear: number;
  ratingCount: number;
  ratingKey: string;
  score: number | undefined;
  summary: string;
  thumb: string;
  title: string;
  titleSort: string;
  updatedAt: Date | undefined;
  userRating: number;
  viewCount: number;

  getRelatedTracks: () => Promise<TrackContainer>;
  getSimilarTracks: () => Promise<TrackContainer>;
  getTrackSrc: () => string;
}

const isTrack = (x: any): x is Track => x._type === 'track';

const toTrack = ($data: Prism<any>): Track => ({
  _type: 'track',

  id: $data.get<string>('ratingKey').transform(toNumber).value!,
  parentId: $data.get<string>('parentRatingKey').transform(toNumber).value!,
  grandparentId: $data.get<string>('grandparentRatingKey').transform(toNumber).value!,

  collections: $data.get('Collection', { quiet: true }).transform(toTagList).value,
  fields: $data.get('Field', { quiet: true }).transform(toFieldList).value,
  genres: $data.get('Genre', { quiet: true }).transform(toTagList).value,
  mbid: $data.get('Guid', { quiet: true }).transform(toTagList).value,
  media: $data.get('Media').toArray().map(toMedia),
  moods: $data.get('Mood', { quiet: true }).transform(toTagList).value,

  addedAt: $data.get<number>('addedAt').transform(toDateFromSeconds).value,
  art: $data.get<string>('art').value,
  deletedAt: $data.get<number>('deletedAt', { quiet: true }).transform(toDateFromSeconds).value,
  distance: $data.get<number>('distance').value,
  duration: $data.get<number>('duration').value,
  globalViewCount: $data.get<number>('globalViewCount').value,
  grandparentArt: $data.get<string>('grandparentArt').value,
  grandparentKey: $data.get<string>('grandparentKey').value,
  grandparentRatingKey: $data.get<string>('grandparentRatingKey').value,
  grandparentThumb: $data.get<string>('grandparentThumb', { quiet: true }).value,
  grandparentTitle: $data.get<string>('grandparentTitle').value,
  grandparentGuid: $data.get<string>('grandparentGuid', { quiet: true }).value,
  guid: $data.get<string>('guid', { quiet: true }).value,
  index: $data.get<number>('index', { quiet: true }).value,
  key: $data.get<string>('key').value,
  lastRatedAt: $data.get<number>('lastRatedAt', { quiet: true }).transform(toDateFromSeconds).value,
  lastViewedAt: $data.get<number>('lastViewedAt', { quiet: true }).transform(toDateFromSeconds)
    .value,
  librarySectionId: $data.get<number>('librarySectionId').value,
  librarySectionKey: $data.get<string>('librarySectionKey').value,
  librarySectionTitle: $data.get<string>('librarySectionTitle').value,
  originallyAvailableAt: $data
    .get<number>('originallyAvailableAt', { quiet: true })
    .transform(toDateFromSeconds).value,
  originalTitle: $data.get<string>('originalTitle', { quiet: true }).value,
  parentGuid: $data.get<string>('parentGuid', { quiet: true }).value,
  parentIndex: $data.get<number>('parentIndex', { quiet: true }).value,
  parentKey: $data.get<string>('parentKey').value,
  parentRatingKey: $data.get<string>('parentRatingKey').value,
  parentStudio: $data.get<string>('parentStudio').value,
  parentThumb: $data.get<string>('parentThumb', { quiet: true }).value,
  parentTitle: $data.get<string>('parentTitle').value,
  parentYear: $data.get<number>('parentYear').value,
  ratingCount: $data.get<number>('ratingCount', { quiet: true }).value,
  ratingKey: $data.get<string>('ratingKey').value,
  score: $data.get<string>('score').transform(toFloat).value,
  summary: $data.get<string>('summary', { quiet: true }).value,
  thumb: $data.get<string>('thumb', { quiet: true }).value,
  title: $data.get<string>('title').value,
  titleSort: $data.get<string>('titleSort', { quiet: true }).value,
  updatedAt: $data.get<number>('updatedAt', { quiet: true }).transform(toDateFromSeconds).value,
  userRating: $data.get<number>('userRating', { quiet: true }).value,
  viewCount: $data.get<number>('viewCount', { quiet: true }).value,

  getRelatedTracks: async function () {
    const library = store.library.peek();
    const { sectionId } = store.serverConfig.peek();
    const similarArtists = await library.metadataSimilar(
      this.grandparentId,
      MediaType.ARTIST,
      new URLSearchParams({
        excludeFields: 'summary',
        excludeElements: 'Mood,Similar,Genre,Style,Country,Media',
      })
    );
    const relatedTracks = await library.sectionItems(
      sectionId,
      MediaType.TRACK,
      new URLSearchParams({
        sort: 'random',
        'track.userRating>': '4',
        'artist.id': similarArtists.artists.map((artist) => artist.id).join(','),
        group: 'guid',
        excludeFields: 'summary',
        excludeElements: 'Mood,Similar,Genre,Style,Country,Media',
      })
    );
    return relatedTracks;
  },

  getSimilarTracks: async function () {
    const library = store.library.peek();
    const similarTracks = await library.metadataNearest(
      this.id,
      MediaType.TRACK,
      new URLSearchParams({
        excludeGrandparentID: this.grandparentId.toString(),
        limit: '50',
        maxDistance: '0.15',
        sort: 'distance',
      })
    );
    return similarTracks;
  },

  getTrackSrc: function () {
    const library = store.library.peek();
    return library.server.getAuthenticatedUrl(this.media[0].parts[0].key);
  },
});

export interface TrackContainer extends MediaContainer {
  _type: string;
  tracks: Track[];
  allowSync: string;
  art: string;
  grandparentRatingKey: string;
  grandparentThumb: string;
  grandparentTitle: string;
  key: string;
  librarySectionID: string;
  librarySectionTitle: string;
  librarySectionUUID: string;
  nocache: string;
  parentIndex: string;
  parentTitle: string;
  parentYear: string;
  thumb: string;
  title1: string;
  title2: string;
  viewGroup: string;
  viewMode: string;
}

const toTrackContainer = ($data: Prism<any>): TrackContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer');
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'trackContainer',

    tracks: $data.get('Metadata', { quiet: true }).toArray().map(toTrack),

    allowSync: $data.get('allowSync').value,
    art: $data.get('art', { quiet: true }).value,
    grandparentRatingKey: $data.get('grandparentRatingKey', { quiet: true }).value,
    grandparentThumb: $data.get('grandparentThumb', { quiet: true }).value,
    grandparentTitle: $data.get('grandparentTitle', { quiet: true }).value,
    key: $data.get('key', { quiet: true }).value,
    librarySectionID: $data.get('librarySectionID').value,
    librarySectionTitle: $data.get('librarySectionTitle').value,
    librarySectionUUID: $data.get('librarySectionUUID').value,
    nocache: $data.get('nocache', { quiet: true }).value,
    parentIndex: $data.get('parentIndex', { quiet: true }).value,
    parentTitle: $data.get('parentTitle', { quiet: true }).value,
    parentYear: $data.get('parentYear', { quiet: true }).value,
    thumb: $data.get('thumb', { quiet: true }).value,
    title1: $data.get('title1', { quiet: true }).value,
    title2: $data.get('title2', { quiet: true }).value,
    viewGroup: $data.get('viewGroup', { quiet: true }).value,
    viewMode: $data.get('viewMode', { quiet: true }).value,
  };
};

const parseTrackContainer = createParser('trackContainer', toTrackContainer);

export {
  isTrack,
  parseTrackContainer,
  toTrack,
  toTrackContainer,
  trackContainerSchema,
  trackSchema,
};
