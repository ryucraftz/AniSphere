import React, { createContext, useState, useContext, useEffect } from 'react';

const GoogleAuthContext = createContext();

export const useGoogleAuth = () => useContext(GoogleAuthContext);

export const GoogleAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('google_user');
            const storedToken = localStorage.getItem('google_access_token');
            const tokenExpiry = localStorage.getItem('google_token_expiry');

            if (storedUser && storedToken && tokenExpiry) {
                const expiryTime = parseInt(tokenExpiry, 10);
                if (Date.now() < expiryTime) {
                    setUser(JSON.parse(storedUser));
                    setAccessToken(storedToken);
                } else {
                    // Token expired, clear storage
                    clearAuthData();
                }
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            clearAuthData();
        } finally {
            setLoading(false);
        }
    }, []);

    const clearAuthData = () => {
        localStorage.removeItem('google_user');
        localStorage.removeItem('google_access_token');
        localStorage.removeItem('google_token_expiry');
        setUser(null);
        setAccessToken(null);
    };

    const login = (credentialResponse) => {
        try {
            // Decode JWT token to get user info
            const token = credentialResponse.credential;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const payload = JSON.parse(jsonPayload);

            const userData = {
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                sub: payload.sub,
            };

            // Store access token (in real app, you'd get this from backend)
            // For now, we'll use the credential as the token
            const expiryTime = Date.now() + 3600000; // 1 hour

            setUser(userData);
            setAccessToken(credentialResponse.access_token || token);

            localStorage.setItem('google_user', JSON.stringify(userData));
            localStorage.setItem('google_access_token', credentialResponse.access_token || token);
            localStorage.setItem('google_token_expiry', expiryTime.toString());
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = () => {
        clearAuthData();
        // Also revoke Google session if needed
        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    };

    const isAuthenticated = () => {
        return !!user && !!accessToken;
    };

    return (
        <GoogleAuthContext.Provider
            value={{
                user,
                accessToken,
                loading,
                login,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </GoogleAuthContext.Provider>
    );
};
