"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { fetcher } from "@/lib/api";
import type { User, AuthResponse, SessionResponse, SignInCredentials, SignUpCredentials } from "@/types/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signUp: (credentials: SignUpCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            const data = await fetcher<SessionResponse>("/api/auth/get-session");
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const signIn = useCallback(async (credentials: SignInCredentials) => {
        const data = await fetcher<AuthResponse>("/api/auth/sign-in/email", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
        setUser(data.user);
    }, []);

    const signUp = useCallback(async (credentials: SignUpCredentials) => {
        const data = await fetcher<AuthResponse>("/api/auth/sign-up/email", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
        setUser(data.user);
    }, []);

    const signOut = useCallback(async () => {
        await fetcher("/api/auth/sign-out", { method: "POST" });
        setUser(null);
    }, []);

    useEffect(() => {
        refreshSession();
    }, [refreshSession]);

    const value = useMemo(
        () => ({
            user,
            loading,
            signIn,
            signUp,
            signOut,
            refreshSession,
        }),
        [user, loading, signIn, signUp, signOut, refreshSession]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
