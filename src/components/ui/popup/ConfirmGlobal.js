import React, { useState, useRef } from 'react';
import ConfirmDialog from './ConfirmDialog';

const confirmAction = {
    current: () => Promise.resolve(true)
}

export function confirm(config) {
    return confirmAction.current(config);
}

function ConfirmGlobal() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [config, setConfig] = useState({});
    const resolveRef = useRef(() => { });
    
    confirmAction.current = (newConfig) =>
        new Promise((resolve) => {
            console.log('Réception de la configuration:', newConfig);
            setConfig(newConfig);
            setDialogOpen(true);
            resolveRef.current = resolve;
        });

    return (
        <div>
            <ConfirmDialog
                onConfirm={() => {
                    console.log('Confirmé');
                    resolveRef.current(true);
                    setDialogOpen(false);
                }}
                onCancel={() => {
                    console.log('Annulé');
                    resolveRef.current(false);
                    setDialogOpen(false);
                }}
                open={dialogOpen}
                {...config}
            />
        </div>
    );
}

export default ConfirmGlobal;
