import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/checkAuth');
                if (response.data.loggedIn) {
                    setCurrentUser({ uid: response.data.uid });
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de l'authentification", error);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la requête. Statut : ' + response.status);
            }

            const data = await response.json();
            console.log(data)
            setCurrentUser({ token: data.token });
        } catch (error) {
            console.error("Erreur lors de la connexion utilisateur", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            setCurrentUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

