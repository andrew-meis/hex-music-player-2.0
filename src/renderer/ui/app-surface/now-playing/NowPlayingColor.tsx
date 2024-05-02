import { observer } from '@legendapp/state/react';
import chroma from 'chroma-js';
import { useColorThiefColor } from 'queries';
import React, { useEffect } from 'react';
import { store } from 'state';

const defaultColor = chroma([90, 90, 90]);

const NowPlayingColor: React.FC = observer(function NowPlayingColor() {
  const library = store.library.get();
  const nowPlaying = store.queue.nowPlaying.get();

  const { data: color } = useColorThiefColor({
    id: nowPlaying.track.thumb,
    url: library.server.getAuthenticatedUrl(nowPlaying.track.thumb),
  });

  useEffect(() => {
    if (color) {
      store.ui.nowPlaying.color.set(color);
    } else {
      store.ui.nowPlaying.color.set(defaultColor);
    }
  }, [color]);

  return null;
});

export default NowPlayingColor;
