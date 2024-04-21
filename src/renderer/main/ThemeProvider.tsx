import { CssVarsProvider } from '@mui/joy/styles';
import extendTheme from '@mui/joy/styles/extendTheme';
import React, { useMemo } from 'react';

declare module '@mui/joy/styles' {
  interface TypographySystemOverrides {
    h5: true;
  }
}

const createTheme = () =>
  extendTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1256,
        xl: 1536,
      },
    },
    components: {
      JoyIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            '&:hover > .MuiSvgIcon-colorNeutral': {
              color: theme.palette.neutral.plainHoverColor,
            },
            '&:hover > .MuiSvgIcon-colorPrimary': {
              color: theme.palette.primary[400],
            },
          }),
        },
      },
      JoyModal: {
        styleOverrides: {
          backdrop: {
            backdropFilter: 'none',
          },
        },
      },
      JoyModalDialog: {
        styleOverrides: {
          root: {
            maxHeight: 384,
            maxWidth: 640,
            minWidth: 512,
          },
        },
      },
      JoySlider: {
        styleOverrides: {
          root: ({ theme }) => ({
            height: 16,
            padding: '0 calc(var(--Slider-size) / 4)',
            '[data-joy-color-scheme="dark"] & .MuiSlider-rail': {
              '--Slider-railBackground': theme.palette.neutral[600],
            },
            '[data-joy-color-scheme="light"] & .MuiSlider-rail': {
              '--Slider-railBackground': theme.palette.neutral[400],
            },
            '& .MuiSlider-track': {
              '--Slider-trackBackground': theme.palette.text.icon,
            },
            ':hover': {
              '& .MuiSlider-thumb': {
                display: 'flex',
              },
              '& .MuiSlider-track': {
                '--Slider-trackBackground': theme.palette.neutral.plainHoverColor,
              },
            },
          }),
          rail: {
            borderRadius: 0,
          },
          thumb: {
            borderRadius: 4,
            boxShadow: 'var(--joy-shadow-sm)',
            display: 'none',
            height: 12,
            width: 12,
            '::before': {
              border: 'none',
            },
          },
          track: {
            borderRadius: 0,
          },
        },
      },
      JoySwitch: {
        styleOverrides: {
          action: {
            display: 'inline-flex',
          },
          thumb: {
            transitionDuration: '150ms',
            transitionProperty: 'left',
            transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
          },
        },
      },
      JoyTooltip: {
        styleOverrides: {
          arrow: ({ theme }) => ({
            '::before': {
              borderColor: theme.palette.background.level2,
            },
          }),
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.level2,
          }),
        },
      },
    },
    fontFamily: {
      display: 'Arimo, sans-serif',
      body: 'Arimo, sans-serif',
    },
    typography: {
      h1: {
        fontFamily: 'TT Commons, sans-serif',
        fontSize: '2.75rem',
        fontWeight: '700',
        letterSpacing: 0,
      },
      h2: {
        fontFamily: 'TT Commons, sans-serif',
        fontSize: '2.5rem',
        fontWeight: '700',
        letterSpacing: 0,
      },
      h3: {
        fontFamily: 'TT Commons, sans-serif',
        fontSize: '2.125rem',
        fontWeight: '700',
        letterSpacing: 0,
      },
      h4: {
        fontFamily: 'TT Commons, sans-serif',
        fontSize: '1.75rem',
        fontWeight: '700',
        letterSpacing: 0,
      },
      h5: {
        fontFamily: 'TT Commons, sans-serif',
        fontSize: '1.5rem',
        fontWeight: '600',
        letterSpacing: 0,
        lineHeight: 'var(--joy-lineHeight-xs)',
      },
    },
  });

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useMemo(() => createTheme(), []);

  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      {children}
    </CssVarsProvider>
  );
};

export default ThemeProvider;
