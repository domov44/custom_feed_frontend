import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Backdrop } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function Popup({ open, onClose, children, title, overflow }) {
  const appContainer = document.getElementById('root');
  const theme = useTheme();

  useEffect(() => {
    if (open) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [open]);

  if (!appContainer) {
    return null;
  }

  return createPortal(
    <>
      <Backdrop open={open} onClick={onClose} style={{ zIndex: 1300, backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
      <Dialog
        open={open}
        onClose={onClose}
        scroll={overflow ? 'paper' : 'body'}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 8,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={Boolean(overflow)}>
          {React.Children.map(children, (child) => React.cloneElement(child, { onClose }))}
        </DialogContent>
      </Dialog>
    </>,
    appContainer
  );
}

export default Popup;
