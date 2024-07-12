import { Box, BoxProps, useColorScheme } from '@mui/material';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, { useEffect, useState } from 'react';

interface ScrollerProps {
  children:
    | (({ viewport }: { viewport: HTMLDivElement | undefined }) => React.ReactNode)
    | React.ReactNode;
}

const Scroller: React.FC<ScrollerProps & Omit<BoxProps, 'children'>> = (props) => {
  const [ref, setRef] = useState<HTMLDivElement | undefined>();
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

  useEffect(() => {
    if (!ref) return;
    initialize({
      target: ref,
      elements: {
        viewport: ref,
      },
    });
  }, [initialize, ref]);

  if (typeof props.children === 'function') {
    return (
      <Box data-overlayscrollbars-initialize ref={setRef} {...props}>
        {props.children({ viewport: ref })}
      </Box>
    );
  }

  return (
    <Box data-overlayscrollbars-initialize ref={setRef} {...props}>
      {props.children}
    </Box>
  );
};

Scroller.displayName = 'Scroller';

export default Scroller;
