import { ObservableComputed, ObservableObject } from '@legendapp/state';
import {
  Album,
  Artist,
  Collection,
  Genre,
  Playlist,
  PlaylistItem,
  PlayQueueItem,
  Track,
} from 'api';

export type Selectable =
  | Artist
  | Album
  | Track
  | Playlist
  | Genre
  | Collection
  | PlayQueueItem
  | PlaylistItem;

export type SelectObservable = ObservableObject<{
  items: Selectable[];
  canMultiselect: ObservableComputed<boolean>;
  selectedIndexes: number[];
  selectedItems: ObservableComputed<Selectable[]>;
}>;
