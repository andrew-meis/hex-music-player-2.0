import { range } from 'lodash';
import { store } from 'state';

const handleClickAway = (event?: MouseEvent | TouchEvent) => {
  if (
    event &&
    event.target instanceof Element &&
    event.target.classList.contains('MuiBackdrop-root')
  )
    return;
  if (store.ui.menus.anchorPosition.peek() !== null) return;
  store.ui.select.selected.set([]);
};

const handleSelect = (event: React.MouseEvent, index: number) => {
  const selected = store.ui.select.selected.peek();
  if (event.ctrlKey || event.metaKey) {
    if (selected.includes(index)) {
      store.ui.select.selected.set((value) => value.filter((n) => n !== index));
      return;
    }
    if (!selected.includes(index)) {
      store.ui.select.selected.set((selected) => [...selected, index]);
      return;
    }
  }
  if (event.shiftKey) {
    if (selected.length === 0) {
      store.ui.select.selected.set(range(0, index + 1));
      return;
    }
    if (index < Math.max(...selected)) {
      store.ui.select.selected.set(range(index, Math.max(...selected) + 1));
      return;
    }
    if (index > Math.min(...selected)) {
      store.ui.select.selected.set(range(Math.min(...selected), index + 1));
      return;
    }
  }
  if (selected.length === 1 && selected.includes(index)) {
    store.ui.select.selected.set([]);
    return;
  }
  store.ui.select.selected.set([index]);
};

export const selectActions = {
  handleClickAway,
  handleSelect,
};
