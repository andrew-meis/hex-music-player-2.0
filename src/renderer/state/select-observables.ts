import { computed, observable } from '@legendapp/state';
import { Selectable, SelectObservable, SelectObservables } from 'typescript';

export const allSelectObservables = {} as Record<string, SelectObservable>;

export const createSelectObservable = (key: SelectObservables) => {
  const newSelectObservable: SelectObservable = observable({
    items: [] as Selectable[],
    canMultiselect: computed(() => {
      const items = newSelectObservable.items.get();
      if (!items) return false;
      return new Set(items.map((item) => item._type)).size <= 1;
    }),
    selectedIndexes: [] as number[],
    selectedItems: computed(() => {
      const items = newSelectObservable.items.get();
      if (!items) return [];
      const selectedIndexes = newSelectObservable.selectedIndexes.get();
      return items.filter((_item, index) => selectedIndexes.includes(index));
    }),
  });
  allSelectObservables[key] = newSelectObservable;
};
