import { observer } from '@legendapp/state/react';
import { Box } from '@mui/joy';
import noiseImage from 'assets/noise.bmp?url';
import chroma from 'chroma-js';
import { useColorThiefColor } from 'queries';
import React from 'react';
import { store } from 'state';

import NowPlayingContent from './NowPlayingContent';

const NowPlayingSurface: React.FC = observer(function AppNowPlaying() {
  const library = store.library.get();
  const nowPlaying = store.audio.nowPlaying.get();

  const { data } = useColorThiefColor({
    id: nowPlaying.track.thumb,
    url: library.api.getAuthenticatedUrl(nowPlaying.track.thumb),
  });

  const defaultColor = chroma([90, 90, 90]);

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
      <Box
        sx={{
          aspectRatio: '21 / 9',
          backgroundImage:
            'linear-gradient(to bottom left, var(--joy-palette-background-level1), var(--joy-palette-neutral-outlinedActiveBg))',
          borderRadius: 16,
          contain: 'paint',
          display: 'flex',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxHeight: '100%',
          width: `calc(${(336 / 466) * 100}vh * (21 / 9))`,
        }}
      >
        <div
          style={{
            backgroundImage: `url(${noiseImage})`,
            borderRadius: 16,
            height: '100%',
            mixBlendMode: 'overlay',
            opacity: 0.08,
            position: 'absolute',
            width: '100%',
          }}
        />
        <div
          style={{
            background: `radial-gradient(ellipse at top right, ${data?.css() || defaultColor.css()}, transparent), radial-gradient(circle at bottom left, ${data?.css() || defaultColor.css()}, transparent)`,
            borderRadius: 16,
            height: '100%',
            mixBlendMode: 'color',
            opacity: 0.6,
            position: 'absolute',
            width: '100%',
          }}
        />
        <NowPlayingContent color={data?.css() || defaultColor.css()} />
      </Box>
    </Box>
  );
});

export default NowPlayingSurface;
