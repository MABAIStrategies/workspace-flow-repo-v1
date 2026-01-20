import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            // TEMPORARY: If we don't have supabase keys, we might want to bypass or show error
            // checks if session exists, else redirect to login
            // For Dev Mode, since keys are missing, session will be null.
            // setSession(true); // Uncomment to fake auth
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Real Implementation
    if (loading) {
        return (
            <div className="h-screen bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-400 font-mono text-sm animate-pulse">Verifying Session...</span>
                </div>
            </div>
        );
    }
    
    if (!session) {
        // Redirect to login if not authenticated
        // We use useEffect to avoid side-effects during render, but for simple guard logic:
        // Ideally returns null and useEffect triggers navigation.
        // For simplicity in this functional component:
        setTimeout(() => navigate('/login'), 0);
        return null; 
    }

    return <>{children}</>;
};

export default AuthGuard;
