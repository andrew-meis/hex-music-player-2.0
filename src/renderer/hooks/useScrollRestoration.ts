import { useMemo, useState } from 'react';
import { useNavigationType } from 'react-router-dom';

const useScrollRestoration = (key: string) => {
  const navigationType = useNavigationType();
  const [isReady, setReady] = useState(false);

  const scrollerProps = useMemo(
    () => ({
      opacity: isReady ? 1 : 0,
      transitionDelay: '100ms',
    }),
    [isReady]
  );

  const initial: number = useMemo(() => {
    let top: any;
    top = sessionStorage.getItem(key);
    if (!top) return 0;
    top = parseInt(top, 10);
    if (navigationType === 'POP') {
      return top;
    }
    sessionStorage.setItem(key, 0 as unknown as string);
    return 0;
  }, [key, navigationType]);

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    sessionStorage.setItem(key, event.currentTarget.scrollTop as unknown as string);
  };

  return [initial, handleScroll, scrollerProps, setReady] as const;
};

export default useScrollRestoration;
