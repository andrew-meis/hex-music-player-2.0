import { useObservable } from '@legendapp/state/react';
import { Box } from '@mui/material';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { inRange } from 'lodash';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, { useEffect, useRef } from 'react';

import NowPlayingAbout from './NowPlayingAbout';
import NowPlayingHeader from './NowPlayingHeader';
import NowPlayingHistory from './NowPlayingHistory';
import NowPlayingLyrics from './NowPlayingLyrics';
import NowPlayingNavigation from './NowPlayingNavigation';
import { LyricsActions } from './NowPlayingSectionActions';
import NowPlayingSimilar from './NowPlayingSimilar';

const Section = ({ children }: { children: React.ReactNode }) => {
  return <section>{children}</section>;
};

const NowPlayingContent: React.FC = () => {
  const activeSection = useObservable<number>(1);
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  console.log('rendering NowPlayingContent');

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const fixedLatest = Math.round(latest * 1e2) / 1e2;
    if (inRange(fixedLatest, 0, 0.25)) {
      activeSection.set(1);
      return;
    }
    if (inRange(fixedLatest, 0.25, 0.5)) {
      activeSection.set(2);
      return;
    }
    if (inRange(fixedLatest, 0.5, 0.75)) {
      activeSection.set(3);
      return;
    }
    if (inRange(fixedLatest, 0.75, 1)) {
      activeSection.set(4);
      return;
    }
    if (fixedLatest === 1) activeSection.set(5);
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
        height="calc(100% - 2px)"
        left={0}
        position="sticky"
        sx={{
          float: 'left',
          marginLeft: '-100%',
        }}
        top={1}
        width={48}
        zIndex={500}
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height={1}
          position="absolute"
          width={48}
        >
          <NowPlayingNavigation
            activeSection={activeSection}
            handleScrollClick={handleScrollClick}
            scrollYProgress={scrollYProgress}
          />
        </Box>
      </Box>
      <Section>
        <NowPlayingHeader activeSection={activeSection} />
      </Section>
      <Section>
        <NowPlayingLyrics />
        <LyricsActions activeSection={activeSection} />
      </Section>
      <Section>
        <NowPlayingAbout />
      </Section>
      <Section>
        <NowPlayingHistory />
      </Section>
      <Section>
        <NowPlayingSimilar />
      </Section>
    </Box>
  );
};

export default NowPlayingContent;
