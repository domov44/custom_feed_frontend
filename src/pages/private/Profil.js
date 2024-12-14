import React from 'react';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { useAuth } from '../../contexts/AuthContext';


export default function Profil() {
    const { currentUser } = useAuth();

    return (
            <Container component="main" maxWidth="xs">
                <Typography variant="h5">{currentUser.username}</Typography>
                <Typography variant="h5">{currentUser.username}</Typography>
                <Typography variant="h5">{currentUser.username}</Typography>
                <Typography variant="h5">{currentUser.username}</Typography>
                <Typography variant="h5">{currentUser.username}</Typography>
                <Typography variant="h5">{currentUser.username}</Typography>
                <Typography variant="h5">{currentUser.username}</Typography>
                <Typography variant="h5">{currentUser.username}</Typography>
                
            </Container>
    );
}