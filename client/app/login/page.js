'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
    const { loading, handleLogin } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showRegisteredBanner, setShowRegisteredBanner] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('registered') === 'true') {
                setShowRegisteredBanner(true);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await handleLogin(email, password);
        if (user) {
            router.push('/');
        }
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="spinner" />
                <p>Signing you in...</p>
            </main>
        );
    }

    return (
        <div className="auth-page">
            <div className="form-container">
                <h1>Login</h1>

                {showRegisteredBanner && (
                    <div className="registered-banner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Account created successfully! Please log in to continue.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                            value={password}
                        />
                    </div>
                    <button className="button primary-button" type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link href="/register">Register here</Link></p>
            </div>
        </div>
    );
}
