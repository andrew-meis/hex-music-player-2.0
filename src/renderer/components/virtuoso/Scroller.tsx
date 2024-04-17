import { useColorScheme } from '@mui/joy';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, { MutableRefObject, useCallback } from 'react';
import { ScrollerProps } from 'react-virtuoso';

const Scroller = React.forwardRef<HTMLDivElement, ScrollerProps>(
  ({ style, children, ...rest }, ref) => {
    const { mode } = useColorScheme();
    const [initialize] = useOverlayScrollbars({
      defer: true,
      options: {
        update: {
          debounce: null,
        },
        scrollbars: {
          autoHide: 'leave',
          autoHideDelay: 500,
          autoHideSuspend: true,
          theme: mode === 'dark' ? 'os-theme-light' : 'os-theme-dark',
          clickScroll: true,
          visibility: 'visible',
        },
      },
    });

    React.useEffect(() => {
      initialize({
        target: (ref as MutableRefObject<HTMLDivElement>).current,
        elements: {
          viewport: (ref as MutableRefObject<HTMLDivElement>).current,
        },
      });
    }, [initialize, ref]);

    const refSetter = useCallback(
      (node: HTMLDivElement) => {
        if (node) {
          (ref as MutableRefObject<HTMLDivElement>).current = node;
        }
      },
      [ref]
    );

    return (
      <div data-overlayscrollbars-initialize ref={refSetter} style={style} {...rest}>
        {children}
      </div>
    );
  }
);

Scroller.displayName = 'Scroller';

export default Scroller;
