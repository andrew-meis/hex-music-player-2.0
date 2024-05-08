import { Memo } from '@legendapp/state/react';
import { Box, Paper, SvgIcon } from '@mui/material';
import noiseImage from 'assets/noise.bmp?url';
import React from 'react';
import { LiaMinusSolid } from 'react-icons/lia';
import { store } from 'state';

import NowPlayingColor from './NowPlayingColor';
import NowPlayingContent from './NowPlayingContent';

const NowPlayingSurface: React.FC<{
  startDrag: (event: React.PointerEvent<SVGSVGElement>) => void;
  endDrag: () => void;
}> = ({ startDrag, endDrag }) => {
  return (
    <Box
      alignItems="center"
      bottom={0}
      display="flex"
      flexShrink={0}
      overflow="hidden"
      top={0}
      width={1}
    >
      <NowPlayingColor />
      <Box
        borderRadius={4}
        component={Paper}
        elevation={0}
        position="relative"
        sx={{
          aspectRatio: '21 / 9',
          backgroundImage:
            'linear-gradient(to bottom left, var(--mui-palette-AppBar-defaultBg), var(--mui-palette-Button-inheritContainedBg))',
          display: 'flex',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: `calc(${(314 / 466) * 100}vh * (21 / 9))`,
        }}
      >
        <div
          style={{
            backgroundImage: `url(${noiseImage})`,
            borderRadius: 16,
            height: '100%',
            mixBlendMode: 'overlay',
            opacity: 0.05,
            position: 'absolute',
            width: '100%',
          }}
        />
        <Memo>
          {() => {
            const color = store.ui.nowPlaying.color.get();
            return (
              <div
                style={{
                  background: `radial-gradient(ellipse at top right, ${color.css()}, transparent), radial-gradient(circle at bottom left, ${color.css()}, transparent)`,
                  borderRadius: 18,
                  height: '100%',
                  mixBlendMode: 'color',
                  opacity: 0.6,
                  position: 'absolute',
                  width: '100%',
                }}
              />
            );
          }}
        </Memo>
        <NowPlayingContent />
        <SvgIcon
          data-is-grabbed="false"
          id="drag-icon"
          sx={{
            color: 'text.secondary',
            cursor: 'grab',
            position: 'absolute',
            left: 0,
            right: 0,
            top: -4,
            margin: 'auto',
            '&:hover': {
              color: 'text.primary',
            },
          }}
          onPointerDown={startDrag}
          onPointerUp={endDrag}
        >
          <LiaMinusSolid />
        </SvgIcon>
      </Box>
    </Box>
  );
};

export default NowPlayingSurface;
