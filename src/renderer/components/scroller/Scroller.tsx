import { Box, BoxProps, useColorScheme } from '@mui/material';
import {
  useOverlayScrollbars,
  UseOverlayScrollbarsInstance,
  UseOverlayScrollbarsParams,
} from 'overlayscrollbars-react';
import React, { useEffect, useState } from 'react';

interface ScrollerProps {
  children:
    | (({
        scroller,
        viewport,
      }: {
        scroller: UseOverlayScrollbarsInstance;
        viewport: HTMLDivElement | undefined;
      }) => React.ReactNode)
    | React.ReactNode;
}

const Scroller: React.FC<
  ScrollerProps & UseOverlayScrollbarsParams & Omit<BoxProps, 'children'>
> = (props) => {
  const [ref, setRef] = useState<HTMLDivElement | undefined>();
  const { mode } = useColorScheme();
  const [initialize, instance] = useOverlayScrollbars({
    defer: true,
    options: {
      overflow: {
        x: 'hidden',
      },
      scrollbars: {
        autoHide: 'leave',
        autoHideDelay: 500,
        autoHideSuspend: true,
        theme: mode === 'dark' ? 'os-theme-light' : 'os-theme-dark',
        clickScroll: true,
        visibility: 'visible',
      },
      update: {
        debounce: null,
      },
      ...props.options,
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
        {props.children({ scroller: instance, viewport: ref })}
      </Box>
    );
  }

  return (
    <Box data-overlayscrollbars-initialize ref={setRef} {...props}>
      {props.children}
    </Box>
  );
};

export default Scroller;
