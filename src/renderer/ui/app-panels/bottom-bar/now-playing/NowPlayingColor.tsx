import { observer } from '@legendapp/state/react';
import { useColorPalette } from 'queries';
import React, { useEffect } from 'react';
import pickColor from 'scripts/pick-color';
import { defaultPalette, store } from 'state';

const NowPlayingColor: React.FC = observer(function NowPlayingColor() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

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

  return null;
});

export default NowPlayingColor;
