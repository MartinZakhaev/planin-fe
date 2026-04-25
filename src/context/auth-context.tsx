"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { fetcher } from "@/lib/api";
import type { User, AuthResponse, SessionResponse, SignInCredentials, SignUpCredentials } from "@/types/auth";

// Extended user type that includes role from better-auth admin plugin response
interface AuthUser {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    banned: boolean;
    banReason: string | null;
    banExpires: string | null;
    profileFileId?: string | null;
    roleId?: string | null;
    role?: {
        id: string;
        name: string;
        displayName: string;
    } | null;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    signIn: (credentials: SignInCredentials) => Promise<void>;
    signUp: (credentials: SignUpCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        const data = await fetcher<SessionResponse>("/api/auth/get-session");

        // Try to fetch full user data from /users endpoint which includes role info
        // This may fail due to permissions for non-admin users
        let enrichedUser: AuthUser | null = null;
        try {
            const usersData = await fetcher<AuthUser[]>("/users");
            enrichedUser = usersData.find(u => u.id === data.user.id) || null;
        } catch {
            // User may not have permission to read all users - use session user instead
        }

        // Use the enriched user from /users if found, otherwise use the basic user from session
        if (enrichedUser) {
            setUser(enrichedUser);
        } else if (data.user) {
            setUser(data.user as unknown as AuthUser);
        } else {
            throw new Error("No user data available from session");
        }
        setLoading(false);
    }, []);

    const signIn = useCallback(async (credentials: SignInCredentials) => {
        await fetcher<AuthResponse>("/api/auth/sign-in/email", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
        // Refresh to get full user data with role info
        await refreshSession();
    }, [refreshSession]);

    const signUp = useCallback(async (credentials: SignUpCredentials) => {
        await fetcher<AuthResponse>("/api/auth/sign-up/email", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
        // Refresh to get full user data with role info
        await refreshSession();
    }, [refreshSession]);

    const signOut = useCallback(async () => {
        await fetcher("/api/auth/sign-out", { method: "POST" });
        setUser(null);
    }, []);

    useEffect(() => {
        refreshSession().catch(() => {
            // Session refresh failed - user is not authenticated
            setUser(null);
            setLoading(false);
        });
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
