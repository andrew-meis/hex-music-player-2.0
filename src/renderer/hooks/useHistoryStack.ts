import { useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

interface LocationState {
  title: string;
}

const useHistoryStack = () => {
  const { key, state } = useLocation();
  const [activeKey, setActiveKey] = useState<string>(key);
  const [stack, setStack] = useState<{key: string, state: LocationState}[]>(
    [{ key, state: { title: 'Home' } }],
  );
  const type = useNavigationType();
  const activeIndex = stack.findIndex((entry) => entry.key === activeKey);

  useEffect(() => {
    if (type === 'POP') {
      setActiveKey(key);
      return;
    }
    if (type === 'PUSH') {
      setStack((prev) => [...prev.slice(0, activeIndex + 1), { key, state }]);
      setActiveKey(key);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, type]);

  return { activeKey, stack };
};

export default useHistoryStack;
