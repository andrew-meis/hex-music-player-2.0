import { Palette, Swatch } from '@vibrant/color';
import { defaultPalette } from 'state';

const pickColor = (palette: Palette): Swatch => {
  if (Object.values(palette).every((value) => value === null)) return defaultPalette.DarkVibrant!;
  if (palette.DarkVibrant) return palette.DarkVibrant;
  if (palette.LightVibrant) return palette.LightVibrant;
  if (palette.Vibrant) return palette.Vibrant;
  if (palette.DarkMuted) return palette.DarkMuted;
  if (palette.LightMuted) return palette.LightMuted;
  if (palette.Muted) return palette.Muted;
  return defaultPalette.DarkVibrant!;
};

export default pickColor;
