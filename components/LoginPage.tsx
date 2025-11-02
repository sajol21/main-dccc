import React, { useState } from 'react';
import { Page } from '../types';
import { handleLogin, checkAdminStatus } from '../services/authService';

interface LoginPageProps {
    onLoginSuccess: (isAdmin: boolean) => void;
    navigateTo: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, navigateTo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await handleLogin(email, password);
            const isAdmin = await checkAdminStatus(userCredential.user.uid);
            onLoginSuccess(isAdmin);
        } catch (err: any) {
            setError(err.message || 'Failed to log in. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center py-16 pt-32 px-4 bg-dc-light">
            <div className="max-w-md w-full bg-white rounded-xl p-8 md:p-12 shadow-medium">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-poppins text-dc-dark">Portal Login</h2>
                    <p className="text-dc-text mt-2">Access your member or admin dashboard.</p>
                </div>

                <form onSubmit={onSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-dc-gray text-dc-dark rounded-lg focus:ring-2 focus:ring-dc-blue focus:outline-none placeholder-gray-400"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-dc-gray text-dc-dark rounded-lg focus:ring-2 focus:ring-dc-blue focus:outline-none placeholder-gray-400"
                            placeholder="Password"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={isLoading} className="w-full bg-dc-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-dc-text">
                        Don't have an account?{' '}
                        <a href={`#${Page.Register}`} onClick={(e) => { e.preventDefault(); navigateTo(Page.Register); }} className="font-medium text-dc-blue hover:underline">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;