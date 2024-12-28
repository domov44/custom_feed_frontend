import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import { useAuth } from "../contexts/AuthContext";

const Logout = () => {
    const { logout } = useAuth();
    const theme = useTheme();

    const handleLogout =  async (e) => {
        await logout();
    };

    return (
        <ListItem
            disablePadding
            sx={{ color: theme.palette.errorColor.main }}
            onClick={handleLogout}
        >
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
                    primary="Logout"
                    sx={{ color: theme.palette.errorColor.main }}
                />
            </ListItemButton>
        </ListItem>
    );
};

export default Logout;
