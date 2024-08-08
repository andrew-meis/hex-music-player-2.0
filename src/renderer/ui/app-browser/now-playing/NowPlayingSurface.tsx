import { Memo } from '@legendapp/state/react';
import { Box, Paper } from '@mui/material';
import noiseImage from 'assets/noise.bmp?url';
import { round } from 'lodash';
import React from 'react';
import { store } from 'state';

import NowPlayingColor from './NowPlayingColor';
import NowPlayingContent from './NowPlayingContent';

const NowPlayingSurface: React.FC = () => {
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
          width: `calc(${round((346 / 500) * 100, 4)}vh * (21 / 9))`,
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
      </Box>
    </Box>
  );
};

export default NowPlayingSurface;
