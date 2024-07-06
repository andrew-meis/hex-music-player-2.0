import Prism from '@zwolf/prism';
import { schema } from 'normalizr';

import { MediaContainer, toMediaContainer } from './media-container';
import { createParser } from './parser';
import { toNumber } from './types';

const sectionSchema = new schema.Entity('sections');

export interface Section {
  _type: string;
  id: number;
  allowSync: boolean;
  art: string;
  composite: string;
  filters: boolean;
  refreshing: boolean;
  thumb: string;
  key: number;
  type: string;
  title: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: Date;
  createdAt: Date;
  location: string[];
}

const sectionContainerSchema = new schema.Object({
  sections: new schema.Array(sectionSchema),
});

export interface SectionContainer extends MediaContainer {
  _type: string;
  title: string;
  sections: Section[];
}

const toSection = ($data: Prism<any>): Section => ({
  _type: 'section',
  id: $data.get('key').transform(toNumber).value!,
  allowSync: $data.get('allowSync').value,
  art: $data.get('art').value,
  composite: $data.get('composite').value,
  filters: $data.get('filters').value,
  refreshing: $data.get('refreshing').value,
  thumb: $data.get('thumb').value,
  key: $data.get('key').value,
  type: $data.get('type').value,
  title: $data.get('title').value,
  agent: $data.get('agent').value,
  scanner: $data.get('scanner').value,
  language: $data.get('language').value,
  uuid: $data.get('uuid').value,
  updatedAt: $data.get('updatedAt').value,
  createdAt: $data.get('createdAt').value,
  location: $data.get('Location').value,
});

const parseSection = createParser('section', toSection);

const toSectionContainer = ($data: Prism<any>): SectionContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer');
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'sectionContainer',

    title: $data.get('title1').value,
    sections: $data.get('Directory').toArray().map(toSection),
  };
};

const parseSectionContainer = createParser('sectionContainer', toSectionContainer);

export { parseSection, parseSectionContainer, sectionContainerSchema, sectionSchema };
