import Scroller from 'components/scroller/Scroller';
import { motion } from 'framer-motion';
import useScrollRestoration from 'hooks/useScrollRestoration';
import { UseOverlayScrollbarsInstance } from 'overlayscrollbars-react';
import React, { ComponentProps } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteContainerProps {
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

const RouteContainer: React.FC<
  RouteContainerProps & Omit<ComponentProps<typeof motion.div>, 'children'>
> = ({ children, style }) => {
  const location = useLocation();
  const [initial, handleScroll, scrollerProps, setReady] = useScrollRestoration(location.key);

  if (typeof children === 'function') {
    return (
      <Scroller sx={{ height: '100%', ...scrollerProps }} onScroll={handleScroll}>
        {({ scroller, viewport }) => {
          return (
            <motion.div
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key={location.pathname}
              style={{ height: 'fit-content', margin: '0 32px', ...style }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              onViewportEnter={() => {
                if (!viewport) return;
                viewport.scrollTop = initial;
                if (viewport.scrollTop === initial) {
                  setReady(true);
                }
              }}
            >
              {children({ scroller, viewport })}
            </motion.div>
          );
        }}
      </Scroller>
    );
  }

  return (
    <Scroller sx={{ height: '100%', ...scrollerProps }} onScroll={handleScroll}>
      {({ viewport }) => {
        return (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={location.pathname}
            style={{ height: 'fit-content', margin: '0 32px', ...style }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            onViewportEnter={() => {
              if (!viewport) return;
              viewport.scrollTop = initial;
              if (viewport.scrollTop === initial) {
                setReady(true);
              }
            }}
          >
            {children}
          </motion.div>
        );
      }}
    </Scroller>
  );
};

export default RouteContainer;
