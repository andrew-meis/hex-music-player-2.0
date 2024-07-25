import { Box, useColorScheme } from '@mui/material';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, { HTMLAttributes, useEffect, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

const ListboxScroller = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>(
  function ListboxScroller(props, listboxRef) {
    const [ref, setRef] = useState<HTMLDivElement | undefined>();
    const { children, ...rest } = props;
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

    return (
      <Box data-overlayscrollbars-initialize ref={mergeRefs([setRef, listboxRef])} {...rest}>
        {children}
      </Box>
    );
  }
);

export default ListboxScroller;
