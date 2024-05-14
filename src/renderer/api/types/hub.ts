import Prism from '@zwolf/prism';
import { schema } from 'normalizr';

import { Album, albumSchema, toAlbum } from './album';
import { Artist, artistSchema, toArtist } from './artist';
import { Collection, collectionSchema, toCollection } from './collection';
import { Genre, genreSchema, toGenre } from './genre';
import { createParser } from './parser';
import { Playlist, playlistSchema, toPlaylist } from './playlist';
import { toTrack, Track, trackSchema } from './track';

const hubSchema = new schema.Entity(
  'hubs',
  {
    items: new schema.Array(
      new schema.Union(
        {
          playlist: playlistSchema,
          artist: artistSchema,
          album: albumSchema,
          track: trackSchema,
          genre: genreSchema,
          collection: collectionSchema,
        },
        'type'
      )
    ),
  },
  {
    idAttribute: 'type',
  }
);

const hubContainerSchema = new schema.Object({
  hubs: new schema.Array(hubSchema),
});

type TransformFunction = ($data: Prism<any>) => Record<string, any>;

const defaultTransformFunction: TransformFunction = ($data) => $data.value;

const getTransformFunction = (type: string): TransformFunction => {
  switch (type) {
    case 'album':
      return toAlbum;
    case 'artist':
      return toArtist;
    case 'track':
      return toTrack;
    case 'playlist':
      return toPlaylist;
    case 'genre':
      return toGenre;
    case 'collection':
      return toCollection;
    default:
      return defaultTransformFunction;
  }
};

export interface Hub {
  _type: string;

  items: (Artist | Album | Track | Playlist | Genre | Collection)[];

  hubIdentifier: string;
  more: boolean;
  size: number;
  title: string;
  type: string;
}

const toHub = ($data: Prism<any>): Hub => {
  const transformFunction = getTransformFunction($data.get('type').value);

  let items: (Artist | Album | Track | Playlist | Genre | Collection)[] = [];

  if ($data.has('Directory')) {
    items = $data
      .get('Directory', { quiet: true })
      .toArray()
      .map(transformFunction)
      .filter(
        (itemA, index, array): itemA is Artist | Album | Track | Playlist | Genre | Collection =>
          array.slice(index + 1).findIndex((itemB) => itemB.id === itemA.id) < 0
      );
  }

  if ($data.has('Metadata')) {
    items = $data
      .get('Metadata', { quiet: true })
      .toArray()
      .map(transformFunction)
      .filter(
        (itemA, index, array): itemA is Artist | Album | Track | Playlist | Genre | Collection =>
          array.slice(index + 1).findIndex((itemB) => itemB.id === itemA.id) < 0
      );
  }

  return {
    _type: 'hub',

    items,

    hubIdentifier: $data.get('hubIdentifier').value,
    more: $data.get('more').value,
    size: $data.get('size').value,
    title: $data.get('title').value,
    type: $data.get('type').value,
  };
};

export interface HubContainer {
  _type: string;

  hubs: Hub[];
}

const validHubs = ['artist', 'album', 'track', 'playlist', 'genre', 'collection'];

const toHubContainer = ($data: Prism<any>): HubContainer => {
  if ($data.has('MediaContainer')) {
    $data = $data.get('MediaContainer');
  }

  return {
    _type: 'hubContainer',

    hubs: $data
      .get('Hub')
      .toArray()
      .filter((hub) => validHubs.includes(hub.get('type').value))
      .map(toHub)
      .filter((hub) => hub !== undefined),
  };
};

const parseHubContainer = createParser('hubContainer', toHubContainer);

export { hubContainerSchema, hubSchema, parseHubContainer };
