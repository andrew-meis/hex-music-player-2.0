import grey from '@mui/material/colors/grey';
import {
  ColorSystemOptions,
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import React, { useMemo } from 'react';

declare module '@mui/material/styles' {
  interface TypeAction {
    hoverSelected: string;
  }
}

const createDarkTheme = (): ColorSystemOptions => ({
  palette: {
    action: {
      hoverSelected: ` 
          rgba(var(--mui-palette-action-selectedChannel) 
          / calc(var(--mui-palette-action-selectedOpacity) 
          + var(--mui-palette-action-hoverOpacity)))
      `,
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
  },
});

const createLightTheme = (): ColorSystemOptions => ({
  palette: {
    action: {
      hoverSelected: ` 
          rgba(var(--mui-palette-action-selectedChannel) 
          / calc(var(--mui-palette-action-selectedOpacity) 
          + var(--mui-palette-action-hoverOpacity)))
      `,
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)',
      secondary: 'rgba(0, 0, 0, 0.85)',
    },
  },
});

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
    colorSchemes: {
      dark: createDarkTheme(),
      light: createLightTheme(),
    },
    components: {
      MuiBreadcrumbs: {
        styleOverrides: {
          ol: {
            justifyContent: 'center',
          },
          root: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: '1.25rem',
            maxHeight: 36,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
          endIcon: {
            margin: 0,
            position: 'absolute',
            right: 12,
          },
        },
      },
      MuiIconButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            color: theme.palette.text.secondary,
            fontSize: '1.375rem',
            height: 36,
            padding: 6,
            width: 36,
            ':hover': {
              backgroundColor: 'transparent',
              color: theme.palette.text.primary,
            },
            '&.selected': {
              color: theme.palette.primary.main,
            },
            '[data-mui-color-scheme="light"] &.selected:hover': {
              color: theme.palette.primary.dark,
            },
            '[data-mui-color-scheme="dark"] &.selected:hover': {
              color: theme.palette.primary.light,
            },
            '&.Mui-focusVisible': {
              outline: `2px solid ${theme.palette.primary.main}`,
            },
          }),
        },
      },
      MuiInputAdornment: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(ownerState.variant === 'standard' &&
              ownerState.position === 'end' && {
                paddingRight: '0.5rem',
              }),
            ...(ownerState.variant === 'standard' &&
              ownerState.position === 'start' && {
                paddingLeft: '0.5rem',
              }),
          }),
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            fontSize: '1.25rem',
            minWidth: '28px !important',
          },
        },
      },
      MuiListItemText: {
        defaultProps: {
          primaryTypographyProps: {
            fontSize: '0.875rem',
          },
        },
      },
      MuiMenu: {
        defaultProps: {
          MenuListProps: {
            sx: {
              paddingY: 0.5,
            },
          },
          slotProps: {
            paper: {
              sx: {
                minWidth: 192,
              },
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 2,
            marginLeft: 4,
            marginRight: 4,
            paddingLeft: 8,
            paddingRight: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            '[data-mui-color-scheme="dark"] &': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiSlider: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.secondary,
            '& .MuiSlider-thumb': {
              display: 'none',
            },
            ':hover': {
              color: theme.palette.primary.main,
              '& .MuiSlider-thumb': {
                display: 'flex',
              },
            },
          }),
          thumb: ({ theme }) => ({
            borderRadius: 4,
            boxShadow: theme.shadows[1],
            color: theme.palette.common.white,
            ':hover': {
              boxShadow: theme.shadows[3],
              color: theme.palette.common.white,
            },
          }),
          thumbColorPrimary: {
            transition: 'none',
          },
          track: {
            border: 'none',
            transition: 'none',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: ({ theme }) => ({
            height: 38,
            width: 58,
            padding: 8,
            '&.Mui-disabled': {
              '&.MuiSwitch-thumb': {
                color: theme.palette.action.selected,
              },
            },
          }),
          switchBase: {
            padding: 10,
            '&.Mui-checked': {
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&+.MuiSwitch-track': {
                opacity: 1,
              },
            },
          },
          thumb: ({ theme }) => ({
            boxShadow: theme.shadows[3],
            width: 18,
            height: 18,
            color: theme.palette.common.white,
          }),
          track: {
            backgroundColor: grey[500],
            borderRadius: 10,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            minHeight: 32,
            maxWidth: 'calc(100% / 4)',
            paddingBottom: 0,
            paddingTop: 0,
            textAlign: 'left',
            textTransform: 'none',
            '&.Mui-selected': {
              color: theme.palette.text.primary,
            },
            '& > .MuiTab-iconWrapper': {
              flexShrink: 0,
            },
          }),
        },
      },
      MuiTabs: {
        styleOverrides: {
          flexContainer: {
            justifyContent: 'center',
          },
          indicator: ({ theme }) => ({
            backgroundColor: theme.palette.action.selected,
            borderRadius: 8,
            height: '100%',
          }),
          root: {
            minHeight: 32,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          InputProps: {
            disableUnderline: true,
          },
          inputProps: {
            style: {
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
            },
          },
        },
        styleOverrides: {
          root: ({ ownerState, theme }) => ({
            ...(ownerState.variant === 'standard' && {
              borderRadius: 4,
              '&>.MuiInputBase-root': {
                '&:hover': {
                  background: theme.palette.action.hover,
                },
                borderRadius: 4,
              },
              '&>.MuiInputBase-root.Mui-focused': {
                background: theme.palette.action.selected,
              },
            }),
          }),
        },
      },
      MuiTooltip: {
        styleOverrides: {
          arrow: ({ theme }) => ({
            color: theme.palette.Button.inheritContainedBg,
          }),
          tooltip: ({ theme }) => ({
            backgroundColor: theme.palette.Button.inheritContainedBg,
            maxWidth: 500,
            padding: 0,
          }),
        },
      },
      MuiTypography: {
        variants: [
          {
            props: { variant: 'h1' },
            style: {
              fontFamily: 'TT Commons, sans-serif',
              fontSize: '2.75rem',
              fontWeight: '700',
            },
          },
          {
            props: { variant: 'h2' },
            style: {
              fontFamily: 'TT Commons, sans-serif',
              fontSize: '2.5rem',
              fontWeight: '700',
            },
          },
          {
            props: { variant: 'h3' },
            style: {
              fontFamily: 'TT Commons, sans-serif',
              fontSize: '2.125rem',
              fontWeight: '700',
            },
          },
          {
            props: { variant: 'h4' },
            style: {
              fontFamily: 'TT Commons, sans-serif',
              fontSize: '1.75rem',
              fontWeight: '700',
            },
          },
          {
            props: { variant: 'h5' },
            style: {
              fontFamily: 'TT Commons, sans-serif',
              fontSize: '1.5rem',
              fontWeight: '600',
            },
          },
          {
            props: { variant: 'h6' },
            style: {
              fontSize: '1.125rem',
              fontWeight: '600',
            },
          },
          {
            props: { variant: 'subtitle1' },
            style: {
              display: '-webkit-box',
              fontFamily: 'Arimo, Arial, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: 1.57,
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
            },
          },
        ],
      },
    },
    typography: {
      fontFamily: ['Arimo', 'Arial', 'sans-serif'].join(','),
    },
  });

const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useMemo(() => createTheme(), []);

  return (
    <CssVarsProvider defaultMode="dark" theme={theme}>
      {children}
    </CssVarsProvider>
  );
};

export default MuiThemeProvider;
