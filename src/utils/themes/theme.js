import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    errorColor: {
      main: '#f44336',
      light: alpha('#f44336', 0.1),
    },
    secondary: {
      main: '#f48fb1',
    },
    paper: '#242424',
  },
});

export default darkTheme;
