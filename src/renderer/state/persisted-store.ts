import { observable } from '@legendapp/state';
import { persistObservable } from '@legendapp/state/persist';
import { Album } from 'api';

const defaultValues = {
  appearsOnFilters: {} as Record<string, { exclusions: string[]; inclusions: string[] }>,
  audio: {
    savedTimeMillis: 0,
    volume: 50,
  },
  lastfmApiKey: '',
  lyricsSize: 2,
  queueId: 0,
  recentSearches: [] as string[],
  sorting: {
    key: 'originallyAvailableAt' as keyof Album,
    order: 'desc' as 'asc' | 'desc',
  },
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
