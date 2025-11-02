import React, { useState } from 'react';
import { Page } from '../types';
import { handleRegister, checkAdminStatus } from '../services/authService';

interface RegisterPageProps {
    onRegisterSuccess: (isAdmin: boolean) => void;
    navigateTo: (page: Page) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, navigateTo }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const userCredential = await handleRegister(email, password);
            const isAdmin = await checkAdminStatus(userCredential.user.uid); 
            onRegisterSuccess(isAdmin);
        } catch (err: any) {
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center py-16 pt-32 px-4 bg-dc-light">
            <div className="max-w-md w-full bg-white rounded-xl p-8 md:p-12 shadow-medium">
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-poppins text-dc-dark">Create Account</h2>
                    <p className="text-dc-text mt-2">Join the DCCC member community.</p>
                </div>

                <form onSubmit={onSubmit} className="mt-8 space-y-6">
                    <input
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-dc-gray text-dc-dark rounded-lg focus:ring-2 focus:ring-dc-blue focus:outline-none placeholder-gray-400"
                        placeholder="Email address"
                    />
                    <input
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-dc-gray text-dc-dark rounded-lg focus:ring-2 focus:ring-dc-blue focus:outline-none placeholder-gray-400"
                        placeholder="Password"
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-dc-gray text-dc-dark rounded-lg focus:ring-2 focus:ring-dc-blue focus:outline-none placeholder-gray-400"
                        placeholder="Confirm Password"
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button type="submit" disabled={isLoading} className="w-full bg-dc-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isLoading ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-dc-text">
                        Already have an account?{' '}
                        <a href={`#${Page.Login}`} onClick={(e) => { e.preventDefault(); navigateTo(Page.Login); }} className="font-medium text-dc-blue hover:underline">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;