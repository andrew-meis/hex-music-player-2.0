import { computed, observable } from '@legendapp/state';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import {
  Account,
  Album,
  Artist,
  Device,
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
  queueId: 5424,
  recentSearches: [] as string[],
});

persistObservable(persistedStore, {
  local: 'persisted-state',
});

export const store = observable({
  // Audio player
  audio: {
    autoplay: false,
    currentTimeMillis: 0,
    intervalTimer: 0,
    isPlaying: false,
    next: undefined as unknown as PlayQueueItem,
    nowPlaying: undefined as unknown as PlayQueueItem,
    previous: undefined as unknown as PlayQueueItem,
    queue: undefined as unknown as PlayQueue,
    queueSrcs: [] as string[],
    seekbarDraggingPosition: undefined as unknown as number,
    updateQueue: false as boolean | 'force-playback',
  },
  // Saved server configuration
  serverConfig: undefined as unknown as ServerConfig,
  // Plex API
  account: undefined as unknown as Account,
  device: undefined as unknown as Device,
  library: undefined as unknown as Library,
  // Search
  searchInput: '',
  // Other application state
  ui: {
    nowPlaying: {
      activeSimilarTracksChip: 0,
      color: chroma([90, 90, 90]),
    },
    menus: {
      anchorPosition: null as null | { mouseX: number; mouseY: number },
      items: [] as (Artist | Album | Track | Playlist | Genre | PlayQueueItem)[],
    },
    modals: {
      editLyricsTrack: undefined as unknown as Track,
      open: '' as '' | 'lyrics',
    },
    selections: computed(() => {
      const ids = store.ui.menus.items.map((value) => value.id.get()) as number[];
      return ids;
    }),
  },
});
