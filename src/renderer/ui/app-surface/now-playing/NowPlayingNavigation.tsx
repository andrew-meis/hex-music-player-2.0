import { observer } from '@legendapp/state/react';
import { Box, IconButton, Tooltip, Typography, useColorScheme } from '@mui/material';
import chroma from 'chroma-js';
import { motion, MotionValue, useTransform } from 'framer-motion';
import React, { useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { IoMdMicrophone } from 'react-icons/io';
import { PiWaveform } from 'react-icons/pi';
import { TbHistory, TbWaveSawTool } from 'react-icons/tb';
import { TiInfoLarge } from 'react-icons/ti';
import { store } from 'state';

const sections = [
  { title: 'Now Playing' },
  { title: 'Lyrics' },
  { title: 'About' },
  { title: 'Track Information' },
  { title: 'Play History' },
  { title: 'Related Tracks' },
];

const NowPlayingNavigation: React.FC<{
  handleScrollClick: (sectionNumber: number) => void;
  scrollYProgress: MotionValue<number>;
}> = observer(function NowPlayingNavigation({ handleScrollClick, scrollYProgress }) {
  const color = store.ui.nowPlaying.color.get();

  const { mode } = useColorScheme();

  const top = useTransform(scrollYProgress, [0, 1], [0, 160]);

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
    <Box
      display="flex"
      flexDirection="column"
      margin="auto"
      sx={{
        contain: 'paint',
        height: 32 * 6,
        mask: `
          url('data:image/svg+xml;utf8,${renderToString(<PiWaveform />)}') no-repeat 4px 4px/24px 24px,
          url('data:image/svg+xml;utf8,${renderToString(<BiMessageSquareDetail />)}') no-repeat 5px 37px/22px 22px,
          url('data:image/svg+xml;utf8,${renderToString(<IoMdMicrophone />)}') no-repeat 5px 69px/22px 22px,
          url('data:image/svg+xml;utf8,${renderToString(<TiInfoLarge />)}') no-repeat 4px 101px/24px 24px,
          url('data:image/svg+xml;utf8,${renderToString(<TbHistory />)}') no-repeat 5px 133px/22px 22px,
          url('data:image/svg+xml;utf8,${renderToString(<TbWaveSawTool />)}') no-repeat 5px 165px/22px 22px
        `,
        width: 1,
      }}
    >
      <Box
        sx={(theme) => ({
          background: mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[400],
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
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -4],
                  },
                },
              ],
            },
          }}
          title={
            <Typography color="text.primary" padding="4px 8px" variant="subtitle2">
              {section.title}
            </Typography>
          }
        >
          <IconButton
            sx={(theme) => ({
              height: 32,
              width: 32,
              '&:hover': {
                backgroundColor: theme.palette.text.primary,
              },
            })}
            onClick={() => handleScrollClick(index + 1)}
          />
        </Tooltip>
      ))}
    </Box>
  );
});

export default NowPlayingNavigation;