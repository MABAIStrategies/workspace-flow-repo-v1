import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check active session
        const checkSession = async () => {
            // 1. Check if user is in "Demo Mode" (Bypass)
            const isDemo = localStorage.getItem('demo_mode') === 'true';
            if (isDemo) {
                setSession({ user: { id: 'demo-user', email: 'demo@example.com' } });
                setLoading(false);
                return;
            }

            // 2. Check Real Supabase Session
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        
        checkSession();

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
        setTimeout(() => navigate('/login'), 0);
        return null; 
    }

    return <>{children}</>;
};

export default AuthGuard;
