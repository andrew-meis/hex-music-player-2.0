import { observable } from '@legendapp/state';
import { persistObservable } from '@legendapp/state/persist';
import { PersistedStore } from 'typescript';

const defaultValues: PersistedStore = {
  appearsOnFilters: {},
  audio: {
    savedTimeMillis: 0,
    volume: 50,
  },
  currentFavorites: {},
  lastfmApiKey: '',
  lyricsSize: 2,
  playlistFolders: {},
  queueId: 0,
  recentSearches: [],
  sorting: {
    key: 'originallyAvailableAt',
    order: 'desc',
  },
  syncLyrics: true,
};

export const persistedStore = observable(defaultValues);

persistObservable(persistedStore, {
  pluginRemote: {
    get: async () => {
      const savedValues = await window.api.getValue('persisted-store');
      return { ...defaultValues, ...savedValues };
    },
    set: ({ value }) => {
      window.api.setValue('persisted-store', value);
    },
  },
});
