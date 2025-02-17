import Prism from '@zwolf/prism';

import { toBoolean } from './types';

export interface Stream {
  _type: string;
  albumGain: string;
  albumPeak: string;
  albumRange: string;
  audioChannelLayout: string;
  bitDepth: number;
  bitrate: number;
  channels: number;
  codec: string;
  displayTitle: string;
  extendedDisplayTitle: string;
  format: string;
  gain: string;
  id: number;
  index: number;
  key: string;
  loudness: string;
  lra: string;
  peak: string;
  provider: string;
  samplingRate: number;
  selected: boolean;
  streamType: number;
  timed: boolean | undefined;
}

const toStream = ($data: Prism<any>): Stream => ({
  _type: 'stream',
  albumGain: $data.get('albumGain', { quiet: true }).value,
  albumPeak: $data.get('albumPeak', { quiet: true }).value,
  albumRange: $data.get('albumRange', { quiet: true }).value,
  audioChannelLayout: $data.get('audioChannelLayout', { quiet: true }).value,
  bitDepth: $data.get('bitDepth', { quiet: true }).value,
  bitrate: $data.get('bitrate', { quiet: true }).value,
  channels: $data.get('channels', { quiet: true }).value,
  codec: $data.get('codec').value,
  displayTitle: $data.get('displayTitle').value,
  extendedDisplayTitle: $data.get('extendedDisplayTitle').value,
  format: $data.get('format', { quiet: true }).value,
  gain: $data.get('gain', { quiet: true }).value,
  id: $data.get('id').value,
  index: $data.get('index', { quiet: true }).value,
  key: $data.get('key', { quiet: true }).value,
  loudness: $data.get('loudness', { quiet: true }).value,
  lra: $data.get('lra', { quiet: true }).value,
  peak: $data.get('peak', { quiet: true }).value,
  provider: $data.get('provider', { quiet: true }).value,
  samplingRate: $data.get('samplingRate', { quiet: true }).value,
  selected: $data.get('selected', { quiet: true }).value,
  streamType: $data.get('streamType').value,
  timed: $data.get('timed', { quiet: true }).transform(toBoolean).value,
});

export { toStream };
