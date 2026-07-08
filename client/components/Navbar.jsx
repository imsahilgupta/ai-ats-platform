'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

const NAV_TOOLS = [
  { href: '/mock-interview', icon: '🎤', label: 'Mock Interview', desc: 'AI-powered voice interview sim' },
  { href: '/resume-analyzer', icon: '📄', label: 'Resume Analyzer', desc: 'ATS score & bullet rewrites' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, handleLogout } = useAuth();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const toolsRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <style>{`
        .global-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 64px;
          background: rgba(250, 250, 248, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
        }
        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon { width: 24px; height: 24px; color: var(--accent); }
        .logo-text { font-size: 1.15rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em; font-family: var(--font-sora); }
        .logo-text .highlight { color: var(--accent); }

        /* Center Nav Links */
        .navbar-center {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
          justify-content: center;
        }
        .nav-link {
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .nav-link:hover { color: var(--text-primary); background: rgba(79, 70, 229, 0.05); }
        .nav-link.active { color: var(--accent); background: rgba(79, 70, 229, 0.08); }

        /* Tools dropdown trigger */
        .tools-trigger {
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          border: none;
          background: none;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .tools-trigger:hover { color: var(--text-primary); background: rgba(79, 70, 229, 0.05); }
        .tools-trigger.open { color: var(--accent); background: rgba(79, 70, 229, 0.08); }
        .tools-trigger svg { transition: transform 0.2s; }
        .tools-trigger.open svg { transform: rotate(180deg); }

        /* Dropdown shared styles */
        .nav-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          background: var(--bg-card);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.5rem;
          z-index: 9999;
          animation: dropIn 0.18s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Tools dropdown */
        .tools-dropdown-wrap { position: relative; }
        .tools-dropdown { width: 300px; left: 50%; transform: translateX(-50%); }
        .tools-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s;
        }
        .tools-dropdown-item:hover { background: rgba(79, 70, 229, 0.04); }
        .tools-dropdown-item.active { background: rgba(79, 70, 229, 0.08); }
        .tools-item-icon {
          font-size: 1.3rem;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--info-bg);
          border-radius: 8px;
          flex-shrink: 0;
        }
        .tools-item-label { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
        .tools-item-desc { font-size: 0.75rem; color: var(--text-muted); margin-top: 1px; }

        /* Right section */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        /* Profile dropdown */
        .profile-wrap { position: relative; }
        .user-avatar-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-alt));
          color: #fff;
          font-weight: 800;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 0 0 2px transparent;
        }
        .user-avatar-btn:hover { box-shadow: 0 0 0 2px var(--accent); transform: scale(1.05); }
        .profile-dropdown { width: 200px; right: 0; }
        .profile-username {
          padding: 0.6rem 0.85rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 0.25rem;
        }
        .profile-username strong { display: block; font-size: 0.88rem; color: var(--text-primary); }
        .profile-username span { font-size: 0.75rem; color: var(--text-muted); }
        .profile-dropdown-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.85rem;
          border-radius: 7px;
          text-decoration: none;
          font-size: 0.85rem;
          color: var(--text-primary);
          transition: all 0.15s;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        .profile-dropdown-link:hover { background: rgba(79, 70, 229, 0.05); color: var(--accent); }
        .profile-dropdown-link.danger:hover { background: rgba(239, 68, 68, 0.08); color: var(--severity-high); }
        .profile-dropdown-divider { height: 1px; background: var(--border-color); margin: 0.25rem 0.5rem; }

        /* Auth buttons */
        .login-link {
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          transition: all 0.18s;
        }
        .login-link:hover { color: var(--text-primary); }
        .register-btn {
          padding: 0.45rem 1.1rem !important;
          background: var(--accent) !important;
          color: #fff !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          font-size: 0.88rem !important;
          text-decoration: none;
          transition: all 0.2s;
        }
        .register-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79, 70, 229, 0.3); background: var(--accent-dark) !important; }

        /* Logout button */
        .logout-btn {
          padding: 0.45rem 0.85rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 7px;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s;
        }
        .logout-btn:hover { border-color: rgba(239, 68, 68, 0.4); color: var(--severity-high); background: rgba(239, 68, 68, 0.05); }

        @media (max-width: 768px) {
          .navbar-center { display: none; }
          .tools-dropdown { left: auto; right: 0; transform: none; }
        }
      `}</style>

      <header className="global-navbar">
        <div className="navbar-container">

          {/* Brand */}
          <Link href="/" className="navbar-logo">
            <svg className="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span className="logo-text">MockMate<span className="highlight">AI</span></span>
          </Link>

          {/* Center Navigation */}
          {user ? (
            <nav className="navbar-center">
              <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Dashboard</Link>

              {/* Tools Dropdown */}
              <div className="tools-dropdown-wrap" ref={toolsRef}>
                <button
                  className={`tools-trigger ${toolsOpen ? 'open' : ''}`}
                  onClick={() => setToolsOpen(v => !v)}
                >
                  Tools
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {toolsOpen && (
                  <div className="nav-dropdown tools-dropdown">
                    {NAV_TOOLS.map(tool => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className={`tools-dropdown-item ${isActive(tool.href) ? 'active' : ''}`}
                        onClick={() => setToolsOpen(false)}
                      >
                        <span className="tools-item-icon">{tool.icon}</span>
                        <div>
                          <div className="tools-item-label">{tool.label}</div>
                          <div className="tools-item-desc">{tool.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
              <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            </nav>
          ) : (
            <nav className="navbar-center">
              <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
              <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            </nav>
          )}

          {/* Right Side */}
          <div className="navbar-right">
            {user ? (
              <>
                {/* Profile avatar dropdown */}
                <div className="profile-wrap" ref={profileRef}>
                  <button
                    className="user-avatar-btn"
                    title="My Account"
                    onClick={() => setProfileOpen(v => !v)}
                  >
                    {getInitials(user.username)}
                  </button>
                  {profileOpen && (
                    <div className="nav-dropdown profile-dropdown">
                      <div className="profile-username">
                        <strong>{user.username}</strong>
                        <span>Signed in</span>
                      </div>
                      <Link href="/profile" className="profile-dropdown-link" onClick={() => setProfileOpen(false)}>
                        <span>👤</span> My Profile
                      </Link>
                      <div className="profile-dropdown-divider" />
                      <button onClick={() => { handleLogout(); setProfileOpen(false); }} className="profile-dropdown-link danger">
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link href="/login" className="login-link">Login</Link>
                <Link href="/register" className="register-btn">Get Started Free</Link>
              </div>
            )}
          </div>

        </div>
      </header>
    </>
  );
}
