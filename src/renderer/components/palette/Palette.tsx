import { ObservableObject } from '@legendapp/state';
import { observer } from '@legendapp/state/react';
import chroma, { Color } from 'chroma-js';
import { useColorThiefColor, useColorThiefPalette } from 'queries';
import React, { useEffect } from 'react';
import { store } from 'state';

const defaultColor = chroma('#848588');
const defaultPalette = [
  chroma('#e8e8e8'),
  chroma('#b6b7b8'),
  chroma('#848588'),
  chroma('#545557'),
  chroma('#242425'),
];

const Palette: React.FC<{
  colorObservable: ObservableObject<Color>;
  paletteObservable: ObservableObject<Color[]>;
  src: string;
  children({ isReady }: { isReady: boolean }): React.ReactNode;
}> = observer(function Palette({ colorObservable, paletteObservable, src, children }) {
  const library = store.library.get();

  const { data: color, ...restColor } = useColorThiefColor({
    id: src,
    url: library.server.getAuthenticatedUrl(src),
  });

  const { data: palette, ...restPalette } = useColorThiefPalette({
    id: src,
    url: library.server.getAuthenticatedUrl(src),
  });

  useEffect(() => {
    if (color) {
      colorObservable.set(color);
    } else {
      colorObservable.set(defaultColor);
    }
    if (palette) {
      paletteObservable.set(palette);
    } else {
      paletteObservable.set(defaultPalette);
    }
  }, [color, palette]);

  if (restColor.isLoading || restPalette.isLoading) {
    return null;
  }

  if (restColor.isError || restPalette.isError) {
    return null;
  }

  return <>{children({ isReady: true })}</>;
});

export default Palette;
