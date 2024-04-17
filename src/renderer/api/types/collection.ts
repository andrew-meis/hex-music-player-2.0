import Prism from '@zwolf/prism';

import { MediaContainer, toMediaContainer } from './media-container';
import { createParser } from './parser';
import { toDateFromSeconds, toNumber } from './types';

export interface Collection {
  _type: string;
  id: number;

  addedAt: Date | undefined;
  childCount: number;
  guid: string;
  index: number;
  key: string;
  maxYear: number;
  minYear: number;
  ratingCount: number;
  ratingKey: string;
  subtype: string;
  summary: string;
  thumb: string;
  title: string;
  type: string;
  updatedAt: Date | undefined;
}

const toCollection = ($data: Prism<any>): Collection => ({
  _type: 'collection',
  id: $data.get<string>('key').transform(toNumber).value!,

  addedAt: $data.get<number>('addedAt').transform(toDateFromSeconds).value,
  childCount: $data.get<number>('childCount').value,
  guid: $data.get<string>('guid', { quiet: true }).value,
  index: $data.get<number>('index').value,
  key: $data.get<string>('key').value,
  maxYear: $data.get<number>('maxYear').value,
  minYear: $data.get<number>('minYear').value,
  ratingCount: $data.get<number>('ratingCount', { quiet: true }).value,
  ratingKey: $data.get<string>('ratingKey').value,
  subtype: $data.get<string>('subtype').value,
  summary: $data.get<string>('summary', { quiet: true }).value,
  thumb: $data.get<string>('thumb', { quiet: true }).value,
  title: $data.get<string>('title').value,
  type: 'collection',
  updatedAt: $data.get<number>('updatedAt').transform(toDateFromSeconds).value,
});

export interface CollectionContainer extends MediaContainer {
  _type: string;
  collections: Collection[];
  allowSync: string;
  art: string;
  librarySectionID: string;
  librarySectionTitle: string;
  librarySectionUUID: string;
  nocache: string;
  thumb: string;
  title1: string;
  title2: string;
  viewGroup: string;
  viewMode: string;
}

const toCollectionContainer = ($data: Prism<any>): CollectionContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer');
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'collectionContainer',

    collections: $data.get('Directory').toArray().map(toCollection),

    allowSync: $data.get('allowSync').value,
    art: $data.get('art', { quiet: true }).value,
    librarySectionID: $data.get('librarySectionID').value,
    librarySectionTitle: $data.get('librarySectionTitle').value,
    librarySectionUUID: $data.get('librarySectionUUID').value,
    nocache: $data.get('nocache', { quiet: true }).value,
    thumb: $data.get('thumb', { quiet: true }).value,
    title1: $data.get('title1', { quiet: true }).value,
    title2: $data.get('title2', { quiet: true }).value,
    viewGroup: $data.get('viewGroup', { quiet: true }).value,
    viewMode: $data.get('viewMode', { quiet: true }).value,
  };
};

const parseCollectionContainer = createParser('collectionContainer', toCollectionContainer);

export { parseCollectionContainer, toCollection, toCollectionContainer };
