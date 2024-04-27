import { useColorScheme } from '@mui/material';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react';
import React from 'react';

const Scroller: React.FC<OverlayScrollbarsComponentProps> = (props) => {
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
      {...props}
    >
      {props.children}
    </OverlayScrollbarsComponent>
  );
};

export default Scroller;
