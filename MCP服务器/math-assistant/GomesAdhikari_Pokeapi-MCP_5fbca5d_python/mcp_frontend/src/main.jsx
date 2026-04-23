import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const pokemonTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e3350d', // Pokémon red
    },
    secondary: {
      main: '#ffcb05', // Pokémon yellow
    },
    background: {
      default: '#f5f5f5', // Light background
      paper: '#fff',
    },
    info: {
      main: '#3b4cca', // Pokémon blue
    },
    success: {
      main: '#30a7d7', // Pokémon cyan
    },
    error: {
      main: '#d62828',
    },
  },
  typography: {
    fontFamily: '"Fredoka One", "Roboto", "Arial", sans-serif',
    h3: { fontWeight: 900, letterSpacing: 2 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
    subtitle2: { fontWeight: 700 },
    button: { fontWeight: 700, letterSpacing: 1 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #e3350d',
          boxShadow: '0 4px 24px 0 rgba(59,76,202,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          fontWeight: 700,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 8,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid #3b4cca',
          backgroundColor: '#fff',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={pokemonTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
