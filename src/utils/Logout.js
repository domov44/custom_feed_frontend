import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';

const Logout = () => {
    const theme = useTheme();

    return (
        <ListItem disablePadding sx={{ color: theme.palette.errorColor.main }}>
            <ListItemButton
                sx={{
                    '&:hover': {
                        backgroundColor: theme.palette.errorColor.light,
                    },
                }}
            >
                <ListItemIcon sx={{ color: theme.palette.errorColor.main }}>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                    primary="Se déconnecter"
                    sx={{ color: theme.palette.errorColor.main }}
                />
            </ListItemButton>
        </ListItem>
    );
};

export default Logout;
