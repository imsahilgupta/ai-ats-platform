'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await handleRegister(username, email, password);
    if (user) {
      router.push('/login?registered=true');
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="spinner" />
        <p>Creating your account...</p>
      </main>
    );
  }

  return (
    <div className="auth-page">
      <div className="form-container">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              value={username}
            />
          </div>
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
          <button className="button primary-button" type="submit">Register</button>
        </form>
        <p>Already have an account? <Link href="/login">Login here</Link></p>
      </div>
    </div>
  );
}
