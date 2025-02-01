import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { notifyError, notifySuccess } from "../components/ui/Toastify";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = Cookies.get("token");
            if (!token) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            const response = await fetch("https://nest-api-sand.vercel.app/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user. Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.username) {
                setCurrentUser({ username: data.username, github: data.githubname });
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error("Error checking authentication", error);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch("https://nest-api-sand.vercel.app/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`Login failed. Status: ${response.status}`);
            }

            const data = await response.json();

            Cookies.set("token", data.access_token, {
                expires: 7,
                secure: true,
                path: "/",
                sameSite: "Strict",
            });

            await checkAuth();
            navigate(ROUTES.HOME);
            notifySuccess("You are logged in");
        } catch (error) {
            notifyError("Login failed. Please try again.");
            console.error("Error logging in", error);
            throw error;
        }
    };

    const signup = async (username, password) => {
        try {
            const response = await fetch("https://nest-api-sand.vercel.app/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`Register failed. Status: ${response.status}`);
            }

            navigate(ROUTES.SIGNIN);
            notifySuccess("Welcome, you can signin");
        } catch (error) {
            notifyError("Register failed. Please try again.");
            console.error("Error register in", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const token = Cookies.get("token");
            if (token) {
                Cookies.remove("token");
                setCurrentUser(null);
                navigate(ROUTES.SIGNIN);
                notifySuccess("You have been logged out.");
            }
        } catch (error) {
            notifyError("Error during logout. Please try again.");
            console.error("Error during logout", error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading, signup }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
