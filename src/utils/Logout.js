import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

const Logout = () => {

    return (
        <ListItem disablePadding sx={{ color: "var(--error-color)" }}>
        <ListItemButton>
            <ListItemIcon sx={{ color: "var(--error-color)" }}>
                <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Se déconnecter" />
        </ListItemButton>
        </ListItem>
    );
};

export default Logout;
