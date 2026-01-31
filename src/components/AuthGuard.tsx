import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context-core';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { session, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !session) {
            navigate('/login');
        }
    }, [loading, session, navigate]);

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
        return null; // Navigation is handled in useEffect
    }

    return <>{children}</>;
};

export default AuthGuard;

