import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Backdrop } from '@mui/material';
import { CiTrash } from 'react-icons/ci';

function ConfirmDialog({
    variant,
    open,
    title,
    content,
    confirmLabel,
    onConfirm,
    onCancel,
}) {
    const appContainer = document.getElementById('root');

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
            <Backdrop open={open} onClick={onCancel} style={{ zIndex: 1300, backgroundColor: 'rgba(0, 0, 0, 0.7)' }} />
            <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
                <form onSubmit={onConfirm} method="dialog">
                    <DialogTitle>{title || "Confirmation"}</DialogTitle>
                    <DialogContent>
                        <Typography>{content || "Voulez-vous vraiment effectuer cette action ?"}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onCancel} variant="text">
                            Not now
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="error"
                            startIcon={<CiTrash />}
                        >
                            {confirmLabel || 'Yes, I confirm'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>,
        appContainer
    );
}

export default ConfirmDialog;
