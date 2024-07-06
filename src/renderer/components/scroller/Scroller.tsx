import { useColorScheme } from '@mui/material';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
  OverlayScrollbarsComponentRef,
} from 'overlayscrollbars-react';
import React from 'react';

const Scroller = React.forwardRef<
  OverlayScrollbarsComponentRef<'div'>,
  OverlayScrollbarsComponentProps
>(function Scroller(props, ref) {
  const { mode } = useColorScheme();
  return (
    <OverlayScrollbarsComponent
      defer
      options={{
        scrollbars: {
          autoHide: 'leave',
          autoHideDelay: 500,
          autoHideSuspend: true,
          clickScroll: true,
          theme: mode === 'dark' ? 'os-theme-light' : 'os-theme-dark',
          visibility: 'visible',
        },
      }}
      ref={ref}
      {...props}
    >
      {props.children}
    </OverlayScrollbarsComponent>
  );
});

export default Scroller;
