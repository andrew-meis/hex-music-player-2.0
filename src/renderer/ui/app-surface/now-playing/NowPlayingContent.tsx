import { useObservable } from '@legendapp/state/react';
import { Box } from '@mui/material';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { inRange } from 'lodash';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, { useEffect, useRef } from 'react';

import NowPlayingAbout from './NowPlayingAbout';
import NowPlayingAvatar from './NowPlayingAvatar';
import NowPlayingHeader from './NowPlayingHeader';
import NowPlayingLyrics from './NowPlayingLyrics';
import NowPlayingMetadata from './NowPlayingMetadata';
import NowPlayingNavigation from './NowPlayingNavigation';
import NowPlayingSectionActions from './NowPlayingSectionActions';
import NowPlayingSimilar from './NowPlayingSimilar';

const Section = ({ children }: { children: React.ReactNode }) => {
  return <section>{children}</section>;
};

const NowPlayingContent: React.FC = () => {
  const activeSection = useObservable<number | undefined>(undefined);
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  console.log('rendering NowPlayingContent');

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const fixedLatest = Math.round(latest * 1e2) / 1e2;
    if (inRange(fixedLatest, 0, 0.2)) {
      activeSection.set(1);
      return;
    }
    if (inRange(fixedLatest, 0.2, 0.4)) {
      activeSection.set(2);
      return;
    }
    if (inRange(fixedLatest, 0.4, 0.6)) {
      activeSection.set(3);
      return;
    }
    if (inRange(fixedLatest, 0.6, 0.8)) {
      activeSection.set(4);
      return;
    }
    if (inRange(fixedLatest, 0.8, 1)) {
      activeSection.set(5);
      return;
    }
    if (fixedLatest === 1) activeSection.set(6);
  });

  const [initialize] = useOverlayScrollbars({
    options: {
      update: {
        debounce: null,
      },
      scrollbars: {
        visibility: 'hidden',
      },
    },
  });

  useEffect(() => {
    if (!ref.current) return;
    initialize({
      target: ref.current,
      elements: {
        viewport: ref.current,
      },
    });
  }, [initialize]);

  const handleScrollClick = (sectionNumber: number) => {
    if (!ref.current) return;
    const el = ref.current.childNodes[sectionNumber] as HTMLDivElement;
    ref.current.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  return (
    <Box
      ref={ref}
      sx={{
        height: '100%',
        overflowX: 'hidden',
        position: 'relative',
        scrollSnapType: 'y mandatory',
        width: '100%',
      }}
    >
      <Box
        height={1}
        position="sticky"
        right={0}
        sx={{
          float: 'right',
          marginRight: '-100%',
        }}
        top={0}
        width={64}
        zIndex={10}
      >
        <div
          style={{
            height: 'calc(100% - 32px)',
            left: '50%',
            position: 'absolute',
            top: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            width: 32,
            zIndex: 500,
          }}
        >
          <Box
            borderRadius={4}
            height={1}
            position="absolute"
            sx={(theme) => ({
              background: theme.palette.background.paper,
            })}
            width={1}
          />
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            height={1}
            position="absolute"
            width={32}
          >
            <NowPlayingAvatar scrollYProgress={scrollYProgress} />
            <NowPlayingNavigation
              handleScrollClick={handleScrollClick}
              scrollYProgress={scrollYProgress}
            />
            <NowPlayingSectionActions activeSection={activeSection} />
          </Box>
        </div>
      </Box>
      <Section>
        <NowPlayingHeader />
      </Section>
      <Section>
        <NowPlayingLyrics />
      </Section>
      <Section>
        <NowPlayingAbout />
      </Section>
      <Section>
        <NowPlayingMetadata />
      </Section>
      <Section>Track play history</Section>
      <Section>
        <NowPlayingSimilar />
      </Section>
    </Box>
  );
};

export default NowPlayingContent;
