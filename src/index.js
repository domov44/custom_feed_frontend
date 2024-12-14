// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './utils/themes/theme';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';

const Root = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<Root />);

reportWebVitals();
