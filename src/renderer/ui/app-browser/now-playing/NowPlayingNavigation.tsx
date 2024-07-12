import { ObservablePrimitiveBaseFns } from '@legendapp/state';
import { observer, reactive } from '@legendapp/state/react';
import { Box, IconButton, SvgIcon, Tooltip, Typography, useColorScheme } from '@mui/material';
import chroma from 'chroma-js';
import { motion, MotionValue, useTransform } from 'framer-motion';
import React, { useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { IoMdMicrophone } from 'react-icons/io';
import { LuDot } from 'react-icons/lu';
import { PiWaveform } from 'react-icons/pi';
import { TbHistory, TbWaveSawTool } from 'react-icons/tb';
import { store } from 'state';

const dotTransformPixels = [-90, -42, 6, 54, 102];

const sections = [
  { title: 'Now Playing' },
  { title: 'Lyrics' },
  { title: 'About' },
  { title: 'Play History' },
  { title: 'Related Tracks' },
];

const ReactiveSvgIcon = reactive(SvgIcon);

const NowPlayingNavigation: React.FC<{
  activeSection: ObservablePrimitiveBaseFns<number>;
  handleScrollClick: (sectionNumber: number) => void;
  scrollYProgress: MotionValue<number>;
}> = observer(function NowPlayingNavigation({ activeSection, handleScrollClick, scrollYProgress }) {
  const color = store.ui.nowPlaying.color.get();

  const { mode } = useColorScheme();

  const top = useTransform(scrollYProgress, [0, 1], [0, 192]);

  const iconColor = useMemo(() => {
    const surfaceColor = chroma(mode === 'dark' ? '#121212' : '#ffffff');
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

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        margin="auto"
        sx={{
          contain: 'paint',
          height: 48 * 5,
          mask: `
          url('data:image/svg+xml;utf8,${renderToString(<PiWaveform />)}') no-repeat 50% 13px/24px 24px,
          url('data:image/svg+xml;utf8,${renderToString(<BiMessageSquareDetail />)}') no-repeat 50% 61px/22px 22px,
          url('data:image/svg+xml;utf8,${renderToString(<IoMdMicrophone />)}') no-repeat 50% 110px/22px 22px,
          url('data:image/svg+xml;utf8,${renderToString(<TbHistory />)}') no-repeat 50% 158px/22px 22px,
          url('data:image/svg+xml;utf8,${renderToString(<TbWaveSawTool />)}') no-repeat 50% 206px/22px 22px
          `,
          width: 1,
        }}
      >
        <Box
          sx={(theme) => ({
            background: mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[400],
            height: '100%',
            width: '100%',
            position: 'absolute',
          })}
        />
        <motion.div
          style={{
            backgroundImage: `radial-gradient(${iconColor} 8px, transparent)`,
            borderRadius: 8,
            height: 48,
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
            placement="right"
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -12],
                    },
                  },
                ],
              },
            }}
            title={
              <Typography color="text.primary" variant="subtitle2">
                {section.title}
              </Typography>
            }
          >
            <IconButton
              sx={(theme) => ({
                height: 48,
                width: 48,
                '&:hover': {
                  backgroundColor: theme.palette.text.primary,
                },
              })}
              onClick={() => handleScrollClick(index + 1)}
            />
          </Tooltip>
        ))}
      </Box>
      <ReactiveSvgIcon
        $sx={() => ({
          color: iconColor,
          position: 'absolute',
          top: '50%',
          transform: `translateY(${dotTransformPixels[activeSection.get() - 1]}px)`,
        })}
      >
        <LuDot />
      </ReactiveSvgIcon>
    </>
  );
});

export default NowPlayingNavigation;
