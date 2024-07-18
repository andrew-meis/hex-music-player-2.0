import { observer } from '@legendapp/state/react';
import chroma, { Color } from 'chroma-js';
import { useColorThiefColor, useColorThiefPalette } from 'queries';
import React from 'react';
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
  children({
    isReady,
    color,
    palette,
  }: {
    isReady: boolean;
    color: Color;
    palette: Color[];
  }): React.ReactNode;
  src: string;
}> = observer(function Palette({ children, src }) {
  const library = store.library.get();

  const { data: color, ...restColor } = useColorThiefColor({
    id: src,
    url: library.server.getAuthenticatedUrl(src),
  });

  const { data: palette, ...restPalette } = useColorThiefPalette({
    id: src,
    url: library.server.getAuthenticatedUrl(src),
  });

  if (restColor.isLoading || restPalette.isLoading) {
    return null;
  }

  if (restColor.isError || restPalette.isError) {
    return null;
  }

  return (
    <>
      {children({
        isReady: true,
        color: color || defaultColor,
        palette: palette || defaultPalette,
      })}
    </>
  );
});

export default Palette;
