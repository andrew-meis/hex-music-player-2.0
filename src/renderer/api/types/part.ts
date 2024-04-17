import Prism from '@zwolf/prism';

import { Stream, toStream } from './stream';
import { toBoolean, toNumber } from './types';

export interface Part {
  _type: string;
  id: string;
  key: string;
  duration: string;
  file: string;
  size: number | undefined;
  container: string;
  hasThumbnail: boolean | undefined;
  streams: Stream[];
}

const toPart = ($data: Prism<any>): Part => ({
  _type: 'part',

  id: $data.get('id').value,
  key: $data.get('key').value,
  duration: $data.get('duration').value,
  file: $data.get('file').value,
  size: $data.get('size').transform(toNumber).value,
  container: $data.get('container').value,
  hasThumbnail: $data.get('hasThumbnail', { quiet: true }).transform(toBoolean).value,

  streams: $data
    .get('Stream', { quiet: true })
    .transform(($data: Prism<any>) => {
      const { value } = $data;
      if (value == null) {
        return [];
      }
      if (Array.isArray(value)) {
        return value;
      }
      return [value];
    })
    .toArray()
    .map(toStream),
});

export { toPart };
