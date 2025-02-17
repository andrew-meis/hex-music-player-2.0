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
import { NavigationEntry } from 'electron';
import { DateTime } from 'luxon';
import { To } from 'react-router-dom';
import {
  AlbumLoaderData,
  AlbumsLoaderData,
  ArtistDiscographyLoaderData,
  ArtistLoaderData,
  ArtistsLoaderData,
  ChartsLoaderData,
  CollectionLoaderData,
  CollectionsLoaderData,
  GenreLoaderData,
  GenresLoaderData,
  NowPlayingLoaderData,
  PlaylistLoaderData,
  PlaylistsLoaderData,
  SearchLoaderData,
  SelectObservables,
  ServerConfig,
  TrackLoaderData,
  TracksLoaderData,
} from 'typescript';

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
  loaders: {
    album: undefined as unknown as AlbumLoaderData,
    albums: undefined as unknown as AlbumsLoaderData,
    artist: undefined as unknown as ArtistLoaderData,
    artistDiscography: undefined as unknown as ArtistDiscographyLoaderData,
    artists: undefined as unknown as ArtistsLoaderData,
    charts: undefined as unknown as ChartsLoaderData,
    collection: undefined as unknown as CollectionLoaderData,
    collections: undefined as unknown as CollectionsLoaderData,
    genre: undefined as unknown as GenreLoaderData,
    genres: undefined as unknown as GenresLoaderData,
    nowPlaying: undefined as unknown as NowPlayingLoaderData,
    playlist: undefined as unknown as PlaylistLoaderData,
    playlists: undefined as unknown as PlaylistsLoaderData,
    search: undefined as unknown as SearchLoaderData,
    track: undefined as unknown as TrackLoaderData,
    tracks: undefined as unknown as TracksLoaderData,
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
        start: DateTime.now().startOf('day').minus({ days: 7 }),
        end: DateTime.now().endOf('day'),
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
        album: { tab: string; album: Album };
        artist: { tab: string; artist: Artist };
        folder: { action: 'edit' | 'new'; currentName: string };
        track: { tab: string; track: Track };
      },
      open: false,
    },
    navigation: {
      activeIndex: 0,
      allEntries: [] as NavigationEntry[],
      canGoBack: false,
      canGoForward: false,
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
