import Prism from '@zwolf/prism';
import { schema } from 'normalizr';

import { MediaContainer, toMediaContainer } from './media-container';
import { createParser } from './parser';
import { toFloat, toNumber } from './types';

const genreSchema = new schema.Entity('genre');

export interface Genre {
  _type: string;
  id: number;
  fastKey: string;
  score: number | undefined;
  title: string;
  type: string;
}

const isGenre = (x: any): x is Genre => x._type === 'genre';

const toGenre = ($data: Prism<any>): Genre => ({
  _type: 'genre',
  id: $data.get<number>('id').value || $data.get<string>('key').transform(toNumber).value!,

  fastKey: $data.get<string>('fastKey').value || $data.get<string>('key').value,
  score: $data.get<string>('score').transform(toFloat).value,
  title: $data.get<string>('title').value || $data.get<string>('tag').value,
  type: $data.get<string>('type').value,
});

export interface GenreContainer extends MediaContainer {
  _type: string;
  genres: Genre[];
}

const toGenreContainer = ($data: Prism<any>): GenreContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer');
  }

  return {
    ...$data.transform(toMediaContainer).value,

    _type: 'genreContainer',

    genres: $data.get('Directory').toArray().map(toGenre),
  };
};

const parseGenreContainer = createParser('genreContainer', toGenreContainer);

export { genreSchema, isGenre, parseGenreContainer, toGenre };
