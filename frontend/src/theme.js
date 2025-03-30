import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002855',  // deep blue for trust and professionalism
      light: '#336d9e',
      dark: '#001935',
    },
    secondary: {
      main: '#575757',  // slate gray for a refined look
      light: '#7a7a7a',
      dark: '#3e3e3e',
    },
    background: {
      default: '#ffffff',  // clean white background
      paper: '#f7f7f7',    // light gray for card backgrounds
    },
    text: {
      primary: '#002855',  // dark blue for headings
      secondary: '#575757' // slate gray for body text
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Merriweather", serif',  // serif font for headings adds gravitas
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#002855',
      marginBottom: '1.5rem',
    },
    h2: {
      fontFamily: '"Merriweather", serif',
      fontSize: '2rem',
      fontWeight: 700,
      color: '#002855',
      marginBottom: '1.2rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#002855',
      marginBottom: '1rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#002855',
      marginBottom: '0.8rem',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#002855',
      marginBottom: '0.5rem',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#002855',
      marginBottom: '0.5rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#575757',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#575757',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#575757',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      color: '#575757',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // consistent spacing across components
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          backgroundColor: '#002855',
          '&:hover': {
            backgroundColor: '#001935',
          },
        },
        outlined: {
          borderColor: '#002855',
          color: '#002855',
          '&:hover': {
            backgroundColor: 'rgba(0,40,85,0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: 24,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          padding: 24,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f0f4f8',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          marginTop: 24,
          marginBottom: 24,
        },
      },
    },
  },
});

export default theme;
