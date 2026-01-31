import React, { useEffect, useState } from 'react';
import type { Session, User, Subscription } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthContext } from './auth-context-core';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        let subscription: Subscription | null = null;

        const checkSession = async () => {
            try {
                // 1. Check Demo Mode
                const demoActive = localStorage.getItem('demo_mode') === 'true';
                setIsDemo(demoActive);

                if (demoActive) {
                    const mockUser = { id: 'demo-user', email: 'demo@example.com' } as User;
                    setUser(mockUser);
                    setSession({ user: mockUser } as Session);
                    setLoading(false);
                    return;
                }

                // 2. Real Supabase Session
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                // 3. Listen for changes
                const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                    setSession(session);
                    setUser(session?.user ?? null);
                });
                subscription = data.subscription;
            } catch (err) {
                console.error("Auth initialization error:", err);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, user, loading, isDemo }}>
            {children}
        </AuthContext.Provider>
    );
};
