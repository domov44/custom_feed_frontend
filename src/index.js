import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './utils/themes/theme';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import { PopupProvider } from './contexts/PopupContext';
import { default as ConfirmGlobal } from './components/ui/popup/ConfirmGlobal';

const Root = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer />
          <PopupProvider>
            <ConfirmGlobal />
            <App />
          </PopupProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<Root />);

reportWebVitals();
