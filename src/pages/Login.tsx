import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // For MVP, we use Magic Link or basic Email/Pass. 
        // Using Magic Link here for "Passwordless" security.
        const { error } = await supabase.auth.signInWithOtp({ email });
        
        if (error) {
            alert(error.message);
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    };

    const handleDevBypass = () => {
        // Temporary bypass for development until Supabase is configured
        // In a real app, this would not exist or be behind a debug flag
        navigate('/app');
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
             {/* Background Image with Overlay */}
             <div className="absolute inset-0 z-0 overflow-hidden">
                <img 
                    alt="Workspace Background" 
                    className="w-full h-full object-cover opacity-30" 
                    src="/Images/background workspace.png" 
                />
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl relative z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <img src="/Images/OfficialCompanyLogo.png" alt="Logo" className="h-12 w-auto mx-auto mb-4 rounded-md shadow-lg" />
                    <h2 className="text-2xl font-bold text-white font-display">Welcome Back</h2>
                    <p className="text-slate-400 text-sm mt-2">Enter your email to access your workspace</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                            placeholder="name@company.com"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-sky-900/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending Magic Link...' : 'Sign In with Email'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <button onClick={handleDevBypass} className="text-xs text-slate-500 hover:text-white transition-colors">
                        (Dev Mode: Bypass Login)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
