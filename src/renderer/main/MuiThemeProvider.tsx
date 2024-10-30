import grey from '@mui/material/colors/grey';
import {
  ColorSystemOptions,
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from '@mui/material/styles';
import chroma from 'chroma-js';
import React, { useMemo } from 'react';

declare module '@mui/material/styles' {
  interface TypeAction {
    hoverSelected: string;
  }
  interface TypographyVariants {
    title1: React.CSSProperties;
    title2: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    title1?: React.CSSProperties;
    title2?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title1: true;
    title2: true;
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
      default: '#fcfcfc',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)',
      secondary: 'rgba(0, 0, 0, 0.7)',
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
      MuiAutocomplete: {
        defaultProps: {
          ListboxProps: {
            sx: {
              padding: '4px 0',
            },
          },
          slotProps: {
            paper: {
              sx: (theme) => ({
                backdropFilter: 'blur(20px)',
                background: theme.palette.action.selected,
                marginTop: 0.5,
              }),
            },
          },
        },
        styleOverrides: {
          inputRoot: {
            paddingBottom: 1,
            paddingTop: 1,
          },
          input: {
            height: 24,
            minWidth: '0 !important',
            padding: '3px 6px !important',
          },
          tag: {
            borderRadius: 4,
          },
        },
      },
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
      MuiDialog: {
        styleOverrides: {
          container: {
            height: 'calc(100% - 9px)',
          },
        },
      },
      MuiDrawer: {
        defaultProps: {
          PaperProps: {
            square: false,
          },
        },
        styleOverrides: {
          paper: ({ theme }) => ({
            backdropFilter: 'blur(20px)',
            background:
              theme.palette.mode === 'dark'
                ? chroma(theme.palette.background.paper).alpha(0.7).css()
                : chroma(theme.palette.background.paper).alpha(0.7).css(),
            height: 'calc(100vh - 194px)',
            borderRadius: 8,
            marginRight: 16,
            marginTop: 88,
            padding: 8,
            width: 'clamp(212px, 25vw, 256px)',
          }),
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
            lineHeight: '1.5rem',
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
          root: {
            '& .MuiSlider-thumb': {
              display: 'none',
            },
            ':hover': {
              '& .MuiSlider-thumb': {
                display: 'flex',
              },
            },
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            bottom: '94px !important',
            zIndex: 2500,
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          message: {
            fontWeight: 700,
            padding: '4px 0',
          },
          root: {
            justifyContent: 'center',
            minWidth: '192px !important',
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
            justifyContent: 'flex-start',
          },
          indicator: ({ theme }) => ({
            backgroundColor: theme.palette.text.primary,
          }),
          root: {
            minHeight: 32,
            overflow: 'visible',
          },
          scroller: {
            overflow: 'visible !important',
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
            color: theme.palette.background.paper,
          }),
          tooltip: ({ theme, ownerState }) => ({
            backgroundColor: theme.palette.background.paper,
            maxWidth: 500,
            padding: ownerState.placement === 'top' ? 2 : '',
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
            props: { variant: 'title1' },
            style: {
              display: '-webkit-box',
              fontFamily: 'Rubik, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              lineHeight: 1.25,
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              wordBreak: 'break-all',
            },
          },
          {
            props: { variant: 'title2' },
            style: {
              display: '-webkit-box',
              fontFamily: 'Arimo, Arial, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: 1.25,
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1,
              wordBreak: 'break-all',
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
