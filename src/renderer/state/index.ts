import { computed, observable } from '@legendapp/state';
import { Palette, Swatch } from '@vibrant/color';
import {
  Account,
  Album,
  Artist,
  Library,
  PlaylistContainer,
  PlayQueue,
  PlayQueueItem,
  Track,
} from 'api';
import { DateTime } from 'luxon';
import { To } from 'react-router-dom';
import { SelectObservables, ServerConfig } from 'typescript';

export const defaultSwatch = new Swatch([128, 128, 128], 0);
export const defaultPalette: Palette = {
  Vibrant: new Swatch([128, 128, 128], 0),
  Muted: new Swatch([128, 128, 128], 0),
  DarkVibrant: new Swatch([88, 88, 88], 0),
  DarkMuted: new Swatch([88, 88, 88], 0),
  LightVibrant: new Swatch([220, 220, 220], 0),
  LightMuted: new Swatch([220, 220, 220], 0),
};

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
    updatePlaylists: false,
    updateQueue: false as boolean | 'force-playback',
  },
  playlists: {
    currentPlaylists: undefined as unknown as PlaylistContainer,
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
  ui: {
    breadcrumbs: [{ title: 'Home', to: { pathname: '/' } }] as { title: string; to: To }[],
    drawers: {
      artist: {
        options: {
          open: false,
        },
      },
      charts: {
        open: false,
        start: DateTime.now().minus({ days: 7 }),
        end: DateTime.now().set({ hour: 23, minute: 59, second: 59 }),
      },
      playlists: {
        open: false,
      },
      queue: {
        open: false,
      },
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
      backward: false,
      forward: false,
    },
    nowPlaying: {
      activeSimilarTracksTab: '0',
      swatch: defaultSwatch,
      palette: defaultPalette,
    },
    queue: {
      activeTab: '0',
      isOverIndex: -1,
    },
    search: {
      input: '',
    },
    toasts: [] as { key: number; message: string }[],
  },
});
