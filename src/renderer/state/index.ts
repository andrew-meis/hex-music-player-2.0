import { computed, observable } from '@legendapp/state';
import { Account, Album, Artist, Library, PlayQueue, PlayQueueItem, Track } from 'api';
import chroma from 'chroma-js';
import { To } from 'react-router-dom';
import { SelectObservables, ServerConfig } from 'typescript';

export { persistedStore } from './persisted-store';
export { allSelectObservables, createSelectObservable } from './select-observables';

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
    repeat: 'none',
    seekbarDraggingPosition: undefined as unknown as number,
  },
  events: {
    newQueue: false,
    updateQueue: false as boolean | 'force-playback',
  },
  queue: {
    currentQueue: undefined as unknown as PlayQueue,
    currentIndex: computed((): number => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return -1;
      return currentQueue.items.findIndex((item) => item.id === currentQueue.selectedItemId);
    }),
    srcs: computed((): string[] => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return [];
      const currentIndex = currentQueue.items.findIndex(
        (item) => item.id === currentQueue.selectedItemId
      );
      return currentQueue.items.slice(currentIndex).map((item) => item.track.getTrackSrc());
    }),
    nowPlaying: computed((): PlayQueueItem => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return undefined as unknown as PlayQueueItem;
      const currentIndex = currentQueue.items.findIndex(
        (item) => item.id === currentQueue.selectedItemId
      );
      return currentQueue.items[currentIndex];
    }),
    next: computed((): PlayQueueItem | undefined => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return undefined;
      const currentIndex = currentQueue.items.findIndex(
        (item) => item.id === currentQueue.selectedItemId
      );
      if (currentQueue.items[currentIndex + 1]) {
        return currentQueue.items[currentIndex + 1];
      }
      return undefined;
    }),
    previous: computed((): PlayQueueItem | undefined => {
      const currentQueue = store.queue.currentQueue.get();
      if (!currentQueue) return undefined;
      const currentIndex = currentQueue.items.findIndex(
        (item) => item.id === currentQueue.selectedItemId
      );
      if (currentQueue.items[currentIndex - 1]) {
        return currentQueue.items[currentIndex - 1];
      }
      return undefined;
    }),
  },
  routes: {
    artist: {
      drawers: { options: false },
    },
  },
  ui: {
    breadcrumbs: [{ title: 'Home', to: { pathname: '/' } }] as { title: string; to: To }[],
    queue: {
      activeTab: '0',
      isOverIndex: -1,
    },
    isDragging: false,
    menus: {
      activeMenu: -1 as SelectObservables,
      anchorPosition: null as null | { mouseX: number; mouseY: number },
    },
    modals: {
      values: undefined as unknown as {
        album: Album;
        artist: Artist;
        track: Track;
      },
      open: false,
    },
    navigation: {
      drawer: false,
    },
    nowPlaying: {
      activeSection: 1,
      activeTab: '0',
      artHovered: false,
      color: chroma([90, 90, 90]),
      palette: [chroma([90, 90, 90]), chroma([90, 90, 90])],
    },
    overlay: false,
    search: {
      input: '',
    },
    toasts: [] as { key: number; message: string }[],
  },
});
