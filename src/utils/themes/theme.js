import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b59cb',
    },
    errorColor: {
      main: '#f44336',
      light: alpha('#f44336', 0.1),
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121014',
      paper: '#1d1824',
    },
  },
});

export default darkTheme;
