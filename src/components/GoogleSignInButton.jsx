import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '../context/GoogleAuthContext';
import { LogOut, User } from 'lucide-react';

function GoogleSignInButton({ mini = false }) {
    const { user, login, logout, isAuthenticated } = useGoogleAuth();

    if (isAuthenticated() && user) {
        return (
            <div className="google-user-profile">
                {mini ? (
                    <button className="user-avatar-btn" onClick={logout}>
                        <img src={user.picture} alt={user.name} />
                    </button>
                ) : (
                    <div className="user-profile-card">
                        <img src={user.picture} alt={user.name} className="user-avatar" />
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                        </div>
                        <button className="btn-logout" onClick={logout}>
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="google-signin-wrapper">
            {mini ? (
                <button className="btn-signin-mini" onClick={() => { }}>
                    <User size={18} />
                    Sign In
                </button>
            ) : (
                <GoogleLogin
                    onSuccess={login}
                    onError={() => {
                        console.error('Login Failed');
                    }}
                    useOneTap={false}
                    theme="filled_black"
                    size="large"
                    text="signin_with"
                    shape="pill"
                />
            )}
        </div>
    );
}

export default GoogleSignInButton;
