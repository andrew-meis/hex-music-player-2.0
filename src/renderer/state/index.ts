import { observable } from '@legendapp/state';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { Account, Device, Library, PlayQueueItem, Track } from 'api';
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
  queueid: 5424,
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
    queueSrcs: [] as string[],
    seekbarDraggingPosition: undefined as unknown as number,
    updateQueue: false,
  },
  // Saved server configuration
  serverConfig: undefined as unknown as ServerConfig,
  // Plex API
  account: undefined as unknown as Account,
  device: undefined as unknown as Device & { uri: string },
  library: undefined as unknown as Library,
  // Search
  searchInput: '',
  // Other application state
  ui: {
    nowPlaying: {
      activeSimilarTracksChip: 0,
    },
    modals: {
      editLyrics: undefined as unknown as Track,
    },
  },
});
