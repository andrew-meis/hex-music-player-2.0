import { computed, observable } from '@legendapp/state';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import {
  Account,
  Album,
  Artist,
  Genre,
  Library,
  Playlist,
  PlayQueue,
  PlayQueueItem,
  Track,
} from 'api';
import chroma from 'chroma-js';
import { ServerConfig } from 'typescript';

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

export const persistedStore = observable({
  // Audio player
  audio: {
    volume: 0.5,
  },
  // User state
  displayRemainingTime: true,
  lastfmApiKey: '',
  queueId: 0,
  recentSearches: [] as string[],
});

persistObservable(persistedStore, {
  local: 'persisted-state',
});

export const store = observable({
  // Saved server configuration
  serverConfig: undefined as unknown as ServerConfig,
  // Plex API
  account: undefined as unknown as Account,
  library: undefined as unknown as Library,
  audio: {
    autoplay: false,
    currentTimeMillis: 0,
    intervalTimer: 0,
    isPlaying: false,
    seekbarDraggingPosition: undefined as unknown as number,
  },
  events: {
    newQueue: false,
    updateQueue: false as boolean | 'force-playback',
  },
  queue: {
    currentQueue: undefined as unknown as PlayQueue,
    srcs: computed(() => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return [];
      const currentIndex = currentQueue.items.findIndex(
        (item) => item.id === currentQueue.selectedItemId
      );
      const value = currentQueue.items
        .slice(currentIndex)
        .map((item) => item.track.getTrackSrc()) as string[];
      return value;
    }),
    nowPlaying: computed(() => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return undefined as unknown as PlayQueueItem;
      const currentIndex = currentQueue.items.findIndex(
        (item) => item.id === currentQueue.selectedItemId
      );
      const value = currentQueue.items[currentIndex] as PlayQueueItem;
      return value;
    }),
    next: computed(() => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return undefined as unknown as PlayQueueItem;
      const currentIndex = currentQueue.items.findIndex(
        (item) => item.id === currentQueue.selectedItemId
      );
      if (currentQueue.items[currentIndex + 1]) {
        const value = currentQueue.items[currentIndex + 1] as PlayQueueItem;
        return value;
      }
      return undefined;
    }),
    previous: computed(() => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return undefined as unknown as PlayQueueItem;
      const currentIndex = currentQueue.items.findIndex(
        (item) => item.id === currentQueue.selectedItemId
      );
      if (currentQueue.items[currentIndex - 1]) {
        const value = currentQueue.items[currentIndex - 1] as PlayQueueItem;
        return value;
      }
      return undefined;
    }),
  },
  ui: {
    nowPlaying: {
      activeSimilarTracksChip: 0,
      color: chroma([90, 90, 90]),
    },
    menus: {
      anchorPosition: null as null | { mouseX: number; mouseY: number },
    },
    modals: {
      editLyricsTrack: undefined as unknown as Track,
      open: '' as '' | 'lyrics',
    },
    search: {
      input: '',
    },
    select: {
      items: [] as (Artist | Album | Track | Playlist | Genre | PlayQueueItem)[],
      selected: [] as number[],
      selectedItems: computed(() => {
        const items = store.ui.select.items.get();
        const selected = store.ui.select.selected.get();
        const value = items.filter((_item, index) => selected.includes(index)) as (
          | Artist
          | Album
          | Track
          | Playlist
          | Genre
          | PlayQueueItem
        )[];
        return value;
      }),
    },
  },
});
