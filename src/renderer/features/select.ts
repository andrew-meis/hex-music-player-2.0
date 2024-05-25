import { range } from 'lodash';
import { store } from 'state';
import { SelectObservable } from 'typescript';

const handleClickAway = (state: SelectObservable, event?: MouseEvent | TouchEvent) => {
  if (
    event &&
    event.target instanceof Element &&
    event.target.classList.contains('MuiBackdrop-root')
  )
    return;
  if (store.ui.menus.anchorPosition.peek() !== null) return;
  state.selectedIndexes.set([]);
};

const handleSelect = (event: React.MouseEvent, index: number, state: SelectObservable) => {
  const selectedIndexes = state.selectedIndexes.peek();
  const canMultiselect = state.canMultiselect.peek();
  if (!canMultiselect) {
    state.selectedIndexes.set([index]);
    return;
  }
  if (event.ctrlKey || event.metaKey) {
    if (selectedIndexes.includes(index)) {
      state.selectedIndexes.set((value) => value.filter((n) => n !== index));
      return;
    }
    if (!selectedIndexes.includes(index)) {
      state.selectedIndexes.set((selected) => [...selected, index]);
      return;
    }
  }
  if (event.shiftKey) {
    if (selectedIndexes.length === 0) {
      state.selectedIndexes.set(range(0, index + 1));
      return;
    }
    if (index < Math.max(...selectedIndexes)) {
      state.selectedIndexes.set(range(index, Math.max(...selectedIndexes) + 1));
      return;
    }
    if (index > Math.min(...selectedIndexes)) {
      state.selectedIndexes.set(range(Math.min(...selectedIndexes), index + 1));
      return;
    }
  }
  if (selectedIndexes.length === 1 && selectedIndexes.includes(index)) {
    state.selectedIndexes.set([]);
    return;
  }
  state.selectedIndexes.set([index]);
};

export const selectActions = {
  handleClickAway,
  handleSelect,
};
