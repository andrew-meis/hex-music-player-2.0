import { selectActions } from 'features/select';
import { useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { allSelectObservables, store } from 'state';

interface LocationState {
  title: string;
}

const useHistoryStack = () => {
  const { key, state } = useLocation();
  const [activeKey, setActiveKey] = useState<string>(key);
  const [stack, setStack] = useState<{ key: string; state: LocationState }[]>([
    { key, state: { title: 'Home' } },
  ]);
  const type = useNavigationType();
  const activeIndex = stack.findIndex((entry) => entry.key === activeKey);

  useEffect(() => {
    if (store.ui.overlay.peek()) {
      store.ui.overlay.set(false);
    }
    if (type === 'POP') {
      Object.keys(allSelectObservables).forEach((key) => {
        if (allSelectObservables[key].selectedIndexes.length > 0) {
          selectActions.handleClickAway(allSelectObservables[key]);
        }
      });
      setActiveKey(key);
      return;
    }
    if (type === 'PUSH') {
      setStack((prev) => [...prev.slice(0, activeIndex + 1), { key, state }]);
      setActiveKey(key);
    }
  }, [key, type]);

  return {
    backward: activeIndex !== 0,
    forward: activeIndex < stack.length - 1,
  };
};

export default useHistoryStack;
