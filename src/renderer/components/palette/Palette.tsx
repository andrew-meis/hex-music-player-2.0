import { observer } from '@legendapp/state/react';
import { Palette as IPalette, Swatch } from '@vibrant/color';
import { useColorPalette } from 'queries';
import React from 'react';
import pickColor from 'scripts/pick-color';
import { defaultPalette, store } from 'state';

const Palette: React.FC<{
  children({
    isReady,
    swatch,
    palette,
  }: {
    isReady: boolean;
    swatch: Swatch;
    palette: IPalette;
  }): React.ReactNode;
  src: string;
}> = observer(function Palette({ children, src }) {
  const library = store.library.get();

  const {
    data: palette,
    isLoading,
    isError,
  } = useColorPalette({
    id: src,
    url: library.server.getAuthenticatedUrl(src),
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    return null;
  }

  return (
    <>
      {children({
        isReady: true,
        swatch: palette ? pickColor(palette) : defaultPalette.DarkVibrant!,
        palette: palette || defaultPalette,
      })}
    </>
  );
});

export default Palette;
