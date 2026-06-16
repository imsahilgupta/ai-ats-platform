'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
    const { loading, handleLogin } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await handleLogin(email, password);
        if (user) {
            router.push("/");
        }
    };

    if (loading) {
        return (
            <main className="loading-screen">
                <h1>Loading...</h1>
            </main>
        );
    }

    return (
        <div className="auth-page">
            <div className="form-container">
                <h1>Login</h1>

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
