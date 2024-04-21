import { Memo, useObservable } from '@legendapp/state/react';
import { Box, IconButton, SvgIcon, Tooltip, useColorScheme } from '@mui/joy';
import chroma from 'chroma-js';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { inRange } from 'lodash';
import { useOverlayScrollbars } from 'overlayscrollbars-react';
import React, { useEffect, useMemo, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import { BiMessageSquareDetail, BiMessageSquareEdit } from 'react-icons/bi';
import { IoMdMicrophone } from 'react-icons/io';
import { PiWaveform } from 'react-icons/pi';
import { TbHistory, TbWaveSawTool } from 'react-icons/tb';
import { TiInfoLarge } from 'react-icons/ti';
import { store } from 'state';

import NowPlayingAbout from './NowPlayingAbout';
import NowPlayingAvatar from './NowPlayingAvatar';
import NowPlayingHeader from './NowPlayingHeader';
import NowPlayingLyrics from './NowPlayingLyrics';
import NowPlayingMetadata from './NowPlayingMetadata';
import NowPlayingSimilar from './NowPlayingSimilar';

const MotionIconButton = motion(IconButton);

const sections = [
  { title: 'Now Playing' },
  { title: 'Lyrics' },
  { title: 'About' },
  { title: 'Track Information' },
  { title: 'Play History' },
  { title: 'Related Tracks' },
];

const Section = ({ children }: { children: React.ReactNode }) => {
  return <section>{children}</section>;
};

const NowPlayingContent: React.FC<{ color: string }> = ({ color }) => {
  const activeSection = useObservable<number | undefined>(undefined);
  const ref = useRef<HTMLElement | null>(null);
  const { mode } = useColorScheme();
  const { scrollYProgress } = useScroll({ container: ref });

  const top = useTransform(scrollYProgress, [0, 1], [0, 160]);

  console.log('render');

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (inRange(latest, 0, 0.2)) {
      activeSection.set(1);
      return;
    }
    if (inRange(latest, 0.2, 0.4)) {
      activeSection.set(2);
      return;
    }
    if (inRange(latest, 0.4, 0.6)) {
      activeSection.set(3);
      return;
    }
    if (inRange(latest, 0.6, 0.8)) {
      activeSection.set(4);
      return;
    }
    if (inRange(latest, 0.8, 1)) {
      activeSection.set(5);
      return;
    }
    if (latest === 1) activeSection.set(6);
  });

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

  const iconColor = useMemo(() => {
    const surfaceColor = chroma(mode === 'dark' ? '#0B0D0E' : '#FBFCFE');
    let contrastColor = chroma(color);
    let contrastValue = chroma.contrast(surfaceColor, contrastColor);
    if (mode === 'dark') {
      while (contrastValue < 8) {
        contrastColor = contrastColor.set('hsv.v', '+0.05');
        contrastValue = chroma.contrast(surfaceColor, contrastColor);
      }
      return contrastColor.css();
    }
    while (contrastValue < 6) {
      contrastColor = contrastColor.set('hsv.v', '-0.05');
      contrastValue = chroma.contrast(surfaceColor, contrastColor);
    }
    return contrastColor.css();
  }, [color, mode]);

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
        zIndex={400}
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
              background: theme.palette.background.surface,
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
            <Box
              display="flex"
              flexDirection="column"
              sx={{
                contain: 'paint',
                height: 32 * 6,
                mask: `
                    url('data:image/svg+xml;utf8,${renderToString(<PiWaveform />)}') no-repeat 4px 4px/24px 24px,
                    url('data:image/svg+xml;utf8,${renderToString(<BiMessageSquareDetail />)}') no-repeat 5px 36px/22px 22px,
                    url('data:image/svg+xml;utf8,${renderToString(<IoMdMicrophone />)}') no-repeat 4px 68px/22px 22px,
                    url('data:image/svg+xml;utf8,${renderToString(<TiInfoLarge />)}') no-repeat 4px 100px/24px 24px,
                    url('data:image/svg+xml;utf8,${renderToString(<TbHistory />)}') no-repeat 4px 132px/22px 22px,
                    url('data:image/svg+xml;utf8,${renderToString(<TbWaveSawTool />)}') no-repeat 4px 164px/22px 22px
                  `,
                width: 1,
              }}
            >
              <Box
                sx={(theme) => ({
                  background:
                    mode === 'dark' ? theme.palette.neutral[500] : theme.palette.neutral[400],
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                })}
              />
              <motion.div
                style={{
                  backgroundImage: `radial-gradient(${iconColor} 8px, transparent)`,
                  borderRadius: 8,
                  height: 32,
                  width: '100%',
                  position: 'absolute',
                  top,
                }}
              />
              {sections.map((section, index) => (
                <Tooltip
                  arrow
                  enterDelay={1000}
                  key={section.title}
                  placement="left"
                  sx={(theme) => ({
                    color:
                      mode === 'dark' ? theme.palette.neutral[300] : theme.palette.neutral[600],
                  })}
                  title={section.title}
                >
                  <IconButton
                    size="sm"
                    sx={(theme) => ({
                      '&:hover': {
                        backgroundColor:
                          mode === 'dark' ? theme.palette.neutral[300] : theme.palette.neutral[600],
                      },
                    })}
                    onClick={() => handleScrollClick(index + 1)}
                  />
                </Tooltip>
              ))}
            </Box>
            <Memo>
              {() => {
                const isActive = activeSection.get() === 2;
                const nowPlaying = store.audio.nowPlaying.get();
                return (
                  <AnimatePresence>
                    {isActive && (
                      <MotionIconButton
                        animate={{ scale: [0, 1.5, 1] }}
                        color="neutral"
                        exit={{ scale: [1, 0] }}
                        initial={{ scale: 0 }}
                        size="sm"
                        sx={{
                          '--IconButton-size': '1.75rem',
                          '--Icon-fontSize': 'calc(2rem /1.6)',
                          marginBottom: 0.25,
                          marginTop: 'auto',
                        }}
                        variant="solid"
                        onClick={() => store.ui.modals.editLyrics.set(nowPlaying.track)}
                      >
                        <SvgIcon viewBox="-1 -1 22 22">
                          <BiMessageSquareEdit />
                        </SvgIcon>
                      </MotionIconButton>
                    )}
                  </AnimatePresence>
                );
              }}
            </Memo>
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
