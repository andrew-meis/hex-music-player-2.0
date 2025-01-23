import { observer } from '@legendapp/state/react';
import { useColorScheme } from '@mui/material';
import chroma from 'chroma-js';
import { useColorPalette, useLyrics } from 'queries';
import React, { useEffect } from 'react';
import pickColor from 'scripts/pick-color';
import { defaultPalette, store } from 'state';

const root = document.documentElement;

const NowPlayingColor: React.FC = observer(function NowPlayingColor() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();
  const swatch = store.ui.nowPlaying.swatch.get();

  const { mode } = useColorScheme();

  useLyrics(nowPlaying.track);

  const { data: palette } = useColorPalette({
    id: nowPlaying.track.thumb,
    url: library.server.getAuthenticatedUrl(nowPlaying.track.thumb),
  });

  useEffect(() => {
    if (palette) {
      store.ui.nowPlaying.swatch.set(pickColor(palette));
      store.ui.nowPlaying.palette.set(palette);
    } else {
      store.ui.nowPlaying.swatch.set(defaultPalette.DarkVibrant);
      store.ui.nowPlaying.palette.set(defaultPalette);
    }
  }, [palette]);

  useEffect(() => {
    if (!swatch || !root) return;
    const newColor =
      mode === 'dark'
        ? chroma(swatch.hex).mix('#000', 0.4, 'rgb').hex()
        : chroma(swatch.hex).mix('#fbfbfb', 0.8, 'rgb').hex();
    root.style.setProperty('--hex-palette-now-playing', newColor);
  }, [mode, swatch]);

  return null;
});

export default NowPlayingColor;
