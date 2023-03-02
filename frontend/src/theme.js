import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // shadows: {1:'none'} ,
  palette: {
    primary: {
      main: '#4361ee',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
  shadows: {
    1: '0px 0px 15px 20px rgba(67,97,238,20%)',
  },
});
