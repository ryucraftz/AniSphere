import React, { createContext, useState, useContext, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

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

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // tokenResponse.access_token is the actual access token we need
                const token = tokenResponse.access_token;

                // Fetch user info using the access token
                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!userInfoResponse.ok) {
                    throw new Error('Failed to fetch user info');
                }

                const userInfo = await userInfoResponse.json();

                const userData = {
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture,
                    id: userInfo.id,
                };

                // Token expires in 1 hour (3600 seconds)
                const expiryTime = Date.now() + (tokenResponse.expires_in * 1000);

                setUser(userData);
                setAccessToken(token);

                localStorage.setItem('google_user', JSON.stringify(userData));
                localStorage.setItem('google_access_token', token);
                localStorage.setItem('google_token_expiry', expiryTime.toString());
            } catch (error) {
                console.error('Error during login:', error);
                clearAuthData();
            }
        },
        onError: (error) => {
            console.error('Login Failed:', error);
        },
        scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    });

    const logout = () => {
        clearAuthData();
        // Revoke the token
        if (accessToken) {
            fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
                method: 'POST',
            }).catch(err => console.error('Error revoking token:', err));
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
                googleLogin,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </GoogleAuthContext.Provider>
    );
};

