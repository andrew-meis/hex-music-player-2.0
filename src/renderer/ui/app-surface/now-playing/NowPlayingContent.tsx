import { Box, Typography } from '@mui/joy';
import { useMeasure } from '@react-hookz/web';
import chroma from 'chroma-js';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, { useEffect, useRef } from 'react';

import NowPlayingAbout from './NowPlayingAbout';
import NowPlayingAvatar from './NowPlayingAvatar';
import NowPlayingHeader from './NowPlayingHeader';
import NowPlayingMetadata from './NowPlayingMetadata';
import NowPlayingSimilar from './NowPlayingSimilar';

const Section = ({ children }: { children: React.ReactNode }) => {
  return <section>{children}</section>;
};

const NowPlayingContent: React.FC<{ color: string }> = ({ color }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [measurements, headerRef] = useMeasure<HTMLDivElement>();
  const { scrollYProgress } = useScroll({ container: ref });

  const left = useTransform(
    scrollYProgress,
    [0, 1],
    [0, (((measurements?.width || 700) - 64) / 5) * 4]
  );

  const [initialize] = useOverlayScrollbars({
    defer: true,
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
    const el = ref.current.childNodes[sectionNumber] as Element;
    el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      ref={ref}
      sx={{
        height: '100%',
        position: 'relative',
        scrollSnapType: 'y mandatory',
        width: '100%',
      }}
    >
      <Box
        left={0}
        position="sticky"
        sx={{
          float: 'left',
          marginRight: '-100%',
        }}
        top={0}
        width={1}
        zIndex={400}
      >
        <div
          ref={headerRef}
          style={{
            height: 32,
            position: 'absolute',
            width: 'calc(100% - 32px)',
            zIndex: 500,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Box
            bgcolor="background.body"
            borderRadius={10}
            display="flex"
            height={32}
            marginTop={2}
            position="absolute"
            width={1}
          />
          <motion.div
            style={{
              background: chroma(color).luminance(0.3).css(),
              borderRadius: 8,
              width: 'calc((100% - 64px) / 5)',
              height: 32,
              marginTop: 16,
              position: 'absolute',
              left,
            }}
          />
          <Box alignItems="center" display="flex" height={64} position="absolute" width={1}>
            {['Now Playing', 'Track Metadata', 'Similar Tracks', 'Play History', 'About'].map(
              (value, index) => (
                <Typography
                  key={value}
                  level="title-sm"
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                  width="20%"
                  onClick={() => handleScrollClick(index + 1)}
                >
                  {value}
                </Typography>
              )
            )}
            <NowPlayingAvatar scrollYProgress={scrollYProgress} />
          </Box>
        </div>
      </Box>
      <Section>
        <NowPlayingHeader />
      </Section>
      <Section>
        <NowPlayingMetadata />
      </Section>
      <Section>
        <NowPlayingSimilar />
      </Section>
      <Section>Track play history</Section>
      <Section>
        <NowPlayingAbout />
      </Section>
    </Box>
  );
};

export default NowPlayingContent;
