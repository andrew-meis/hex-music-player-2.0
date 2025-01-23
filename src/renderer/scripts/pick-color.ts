import { Palette, Swatch } from '@vibrant/color';
import { defaultPalette } from 'state';

import { ntc } from './name-the-color';

function isBrown(hex: string) {
  return ntc.name(hex)[3] === 'Brown';
}

const pickColor = (palette: Palette): Swatch => {
  if (Object.values(palette).every((value) => value === null)) return defaultPalette.DarkVibrant!;
  if (
    Object.values(palette)
      .filter((value) => value !== null)
      .every((value) => isBrown(value.hex))
  ) {
    return (
      palette.DarkVibrant ||
      palette.Vibrant ||
      palette.LightVibrant ||
      palette.DarkMuted ||
      palette.Muted ||
      palette.LightMuted ||
      defaultPalette.DarkVibrant!
    );
  }
  if (palette.Vibrant && !isBrown(palette.Vibrant.hex)) return palette.Vibrant;
  if (palette.DarkVibrant && !isBrown(palette.DarkVibrant.hex)) return palette.DarkVibrant;
  if (palette.LightVibrant && !isBrown(palette.LightVibrant.hex)) return palette.LightVibrant;
  if (palette.Muted && !isBrown(palette.Muted.hex)) return palette.Muted;
  if (palette.DarkMuted && !isBrown(palette.DarkMuted.hex)) return palette.DarkMuted;
  if (palette.LightMuted && !isBrown(palette.LightMuted.hex)) return palette.LightMuted;
  return defaultPalette.DarkVibrant!;
};

export default pickColor;
