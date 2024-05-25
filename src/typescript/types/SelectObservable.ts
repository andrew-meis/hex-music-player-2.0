import { ObservableComputed, ObservableObject } from '@legendapp/state';
import { Album, Artist, Collection, Genre, Playlist, PlayQueueItem, Track } from 'api';

export type SelectObservable = ObservableObject<{
  items: (Artist | Album | Track | Playlist | Genre | PlayQueueItem | Collection)[];
  canMultiselect: ObservableComputed<boolean>;
  selectedIndexes: number[];
  selectedItems: ObservableComputed<
    (Artist | Album | Track | Playlist | Genre | PlayQueueItem | Collection)[]
  >;
}>;
