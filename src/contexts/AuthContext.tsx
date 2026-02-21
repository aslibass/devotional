import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export interface AuthUser {
    name: string;
    email: string;
    picture: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    signIn: (googleCredential: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on page load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${API_URL}/api/auth/me`, {
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch {
                // No session — stay logged out
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const signIn = useCallback(async (googleCredential: string) => {
        const res = await fetch(`${API_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ credential: googleCredential }),
        });

        if (!res.ok) {
            throw new Error('Sign-in failed. Please try again.');
        }

        const data = await res.json();
        setUser(data.user);
    }, []);

    const signOut = useCallback(async () => {
        await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
