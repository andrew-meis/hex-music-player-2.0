import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

type BreakpointOrNull = Breakpoint | null;

export const useWidth = (): Breakpoint => {
  const theme = useTheme();
  const keys: readonly Breakpoint[] = [...theme.breakpoints.keys];
  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return matches ? key : output;
    }, null) ?? 'xs'
  );
};
