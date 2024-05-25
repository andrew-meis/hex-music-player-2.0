import Prism from '@zwolf/prism';
import { schema } from 'normalizr';

import { MediaContainer, toMediaContainer } from './media-container';
import { createParser } from './parser';
import { toDate, toNumber, toTimestamp } from './types';

const historySchema = new schema.Entity('history');

export interface HistoryEntry {
  _type: string;

  accountID: number;
  deviceID: number;
  grandparentArt: string;
  grandparentKey: string;
  grandparentTitle: string;
  grandparentThumb: string;
  historyKey: string;
  index: number;
  key: string;
  librarySectionID: number;
  parentIndex: number;
  parentKey: string;
  parentThumb: string;
  parentTitle: string;
  ratingKey: string;
  thumb: string;
  title: string;
  type: string;
  viewedAt: Date;
}

const toHistoryEntry = ($data: Prism<any>): HistoryEntry => ({
  _type: 'historyEntry',

  accountID: $data.get<number>('accountID').value,
  deviceID: $data.get<number>('deviceID').value,
  grandparentArt: $data.get<string>('grandparentArt').value,
  grandparentKey: $data.get<string>('grandparentKey').value,
  grandparentTitle: $data.get<string>('grandparentTitle').value,
  grandparentThumb: $data.get<string>('grandparentThumb').value,
  historyKey: $data.get<string>('historyKey').value,
  index: $data.get<number>('index').value,
  key: $data.get<string>('key').value,
  librarySectionID: $data.get<string>('librarySectionID').transform(toNumber).value!,
  parentIndex: $data.get<number>('parentIndex').value,
  parentKey: $data.get<string>('parentKey').value,
  parentThumb: $data.get<string>('parentThumb').value,
  parentTitle: $data.get<string>('parentTitle').value,
  ratingKey: $data.get<string>('ratingKey').value,
  thumb: $data.get<string>('thumb').value,
  title: $data.get<string>('title').value,
  type: $data.get<string>('type').value,
  viewedAt: $data.get<number>('viewedAt').transform(toTimestamp).transform(toDate).value!,
});

export interface HistoryContainer extends MediaContainer {
  _type: string;
  entries: HistoryEntry[];
}

const toHistoryContainer = ($data: Prism<any>): HistoryContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer');
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'historyContainer',

    entries: $data.get('Metadata').toArray().map(toHistoryEntry),
  };
};

const parseHistoryContainer = createParser('historyContainer', toHistoryContainer);

export { historySchema, parseHistoryContainer };
