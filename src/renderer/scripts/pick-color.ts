import { Palette, Swatch } from '@vibrant/color';
import chroma from 'chroma-js';
import { defaultPalette } from 'state';

function isBrown(hex: string) {
  const color = chroma(hex).hsl();

  const minHue = 20;
  const maxHue = 40;
  const minSat = 0.2;
  const maxSat = 0.7;

  return color[0] >= minHue && color[0] <= maxHue && color[1] >= minSat && color[1] <= maxSat;
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
  if (palette.DarkVibrant && !isBrown(palette.DarkVibrant.hex)) return palette.DarkVibrant;
  if (palette.Vibrant && !isBrown(palette.Vibrant.hex)) return palette.Vibrant;
  if (palette.LightVibrant && !isBrown(palette.LightVibrant.hex)) return palette.LightVibrant;
  if (palette.DarkMuted && !isBrown(palette.DarkMuted.hex)) return palette.DarkMuted;
  if (palette.Muted && !isBrown(palette.Muted.hex)) return palette.Muted;
  if (palette.LightMuted && !isBrown(palette.LightMuted.hex)) return palette.LightMuted;
  return defaultPalette.DarkVibrant!;
};

export default pickColor;
