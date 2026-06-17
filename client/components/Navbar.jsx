'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
    const pathname = usePathname();
    const { user, handleLogout } = useAuth();

    // Extract first character of username for the profile avatar
    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : '?';
    };

    return (
        <header className="global-navbar">
            <div className="navbar-container">
                {/* Brand Logo */}
                <Link href="/" className="navbar-logo">
                    <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                    </svg>
                    <span className="logo-text">MockMate<span className="highlight">AI</span></span>
                </Link>

                {/* Navigation Actions */}
                <nav className="navbar-menu">
                    {user ? (
                        <div className="user-profile-section">
                            <Link href="/about" className="login-link">About</Link>
                            <Link href="/contact" className="login-link">Contact</Link>
                            <span className="welcome-message">
                                Welcome, <strong className="username-text">{user.username}</strong>
                            </span>
                            
                            {/* User Initials Circle */}
                            <div className="user-avatar" title={user.email}>
                                {getInitials(user.username)}
                            </div>

                            {/* Logout Button */}
                            <button onClick={handleLogout} className="logout-btn" title="Logout">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link href="/about" className="login-link">About</Link>
                            <Link href="/contact" className="login-link">Contact</Link>
                            <Link href="/login" className="login-link">Login</Link>
                            <Link href="/register" className="button primary-button register-btn">Get Started</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
