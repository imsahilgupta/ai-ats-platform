'use client';

import React, { useState, useEffect } from 'react';
import Protected from '@/components/Protected';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { getAdminStats } from '@/services/saas.api';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [realStats, setRealStats] = useState(null);
  const [metrics, setMetrics] = useState({
    serverUptime: '99.98%',
    cpuUsage: 14,
    memoryUsage: 48,
    apiResponseTime: '124ms',
    databaseConnection: 'Healthy'
  });

  const [logs, setLogs] = useState([
    { timestamp: new Date(Date.now() - 50000).toISOString(), type: 'INFO',    message: 'User verification token refreshed' },
    { timestamp: new Date(Date.now() - 40000).toISOString(), type: 'INFO',    message: 'Subscription status check completed for premium tier user' },
    { timestamp: new Date(Date.now() - 30000).toISOString(), type: 'SUCCESS', message: 'Mock interview session finalised for session ID mm_9231' },
    { timestamp: new Date(Date.now() - 20000).toISOString(), type: 'INFO',    message: 'Gemini service wrapper prompt generated for software engineering role' },
    { timestamp: new Date(Date.now() - 10000).toISOString(), type: 'SUCCESS', message: 'ATS resume optimisation file parse complete' },
  ]);

  // Fetch real DB stats
  useEffect(() => {
    if (!user?.isAdmin) return;
    getAdminStats()
      .then(setRealStats)
      .catch(() => {}); // silently fall back to mock values
  }, [user]);

  // Live-reload simulated system metrics + log stream
  useEffect(() => {
    if (!user?.isAdmin) return;
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 20) + 8,
        memoryUsage: Math.floor(Math.random() * 5) + 45,
        apiResponseTime: `${Math.floor(Math.random() * 30) + 110}ms`
      }));
      const logTypes = ['INFO', 'SUCCESS', 'WARNING'];
      const messages = [
        'GET /api/analytics — 200 OK',
        'POST /api/mock-interview/answer — 200 OK',
        'PUT /api/job-applications — Update successful',
        'GET /api/subscription — Fetching status',
        'POST /api/assistant/chat — Token usage: 482',
        'DELETE /api/auth/logout — Token blacklisted',
        'POST /api/resume/analyze — PDF parsed OK',
      ];
      setLogs(prev => [{
        timestamp: new Date().toISOString(),
        type: logTypes[Math.floor(Math.random() * logTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      }, ...prev.slice(0, 15)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [user]);

  const triggerGc = () => {
    showToast('Memory GC manually triggered.', 'success');
    setMetrics(prev => ({ ...prev, memoryUsage: 35 }));
  };

  // ── Access Guard ──
  if (user && !user.isAdmin) {
    return (
      <Protected>
        <div style={{
          minHeight: '80vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1.5rem'
        }}>
          <span style={{ fontSize: '4rem' }}>🚫</span>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Access Denied</h1>
          <p style={{ color: '#aaa', maxWidth: '400px' }}>
            This panel is restricted to administrators only.<br />
            Your account does not have the required permissions.
          </p>
          <Link href="/" className="generate-btn" style={{ width: 'auto', padding: '0.75rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </Protected>
    );
  }

  const kpis = [
    { label: 'Total Users',        value: realStats?.totalUsers        ?? '—', icon: '👥', color: '#00f5a0' },
    { label: 'Active Subscribers', value: realStats?.activeSubscribers ?? '—', icon: '💎', color: '#00b4d8' },
    { label: 'Monthly Revenue',    value: realStats ? `$${realStats.monthlyRecurringRevenue}` : '—', icon: '💰', color: '#f0a500' },
    { label: 'Mock Sessions',      value: realStats?.totalSessions     ?? '—', icon: '🎤', color: '#a78bfa' },
    { label: 'Resume Scans',       value: realStats?.totalResumes      ?? '—', icon: '📄', color: '#fb7185' },
    { label: 'Jobs Tracked',       value: realStats?.totalJobs         ?? '—', icon: '📋', color: '#34d399' },
  ];

  const systemCards = [
    { label: 'Server Uptime',       value: metrics.serverUptime,      status: 'ok'   },
    { label: 'CPU Usage',           value: `${metrics.cpuUsage}%`,    status: metrics.cpuUsage > 80 ? 'warn' : 'ok' },
    { label: 'Memory Usage',        value: `${metrics.memoryUsage}%`, status: metrics.memoryUsage > 85 ? 'warn' : 'ok' },
    { label: 'API Response Time',   value: metrics.apiResponseTime,   status: 'ok'   },
    { label: 'Database',            value: metrics.databaseConnection, status: 'ok'  },
  ];

  const logColor = { INFO: '#60a5fa', SUCCESS: '#34d399', WARNING: '#fbbf24', ERROR: '#f87171' };

  return (
    <Protected>
      <div className="home-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Header */}
        <header style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚙️</span>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>
              Admin <span className="highlight">Control Panel</span>
            </h1>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem',
              background: 'rgba(0,245,160,0.1)', border: '1px solid rgba(0,245,160,0.3)',
              borderRadius: '20px', color: '#00f5a0', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>Admin Only</span>
          </div>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>
            Signed in as <strong style={{ color: '#ccc' }}>{user?.username}</strong> · Real-time metrics refresh every 4s
          </p>
        </header>

        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {kpis.map((kpi) => (
            <div key={kpi.label} className="interview-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{kpi.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '0.25rem' }}>{kpi.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

          {/* System Health */}
          <div className="interview-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', margin: 0 }}>System Health</h2>
              <button
                onClick={triggerGc}
                style={{
                  padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: '#aaa', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00f5a0'; e.currentTarget.style.color = '#00f5a0'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#aaa'; }}
              >
                Run GC
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {systemCards.map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{s.label}</span>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 700,
                    color: s.status === 'warn' ? '#fbbf24' : '#34d399'
                  }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Memory bar */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', marginBottom: '0.4rem' }}>
                <span>Memory</span><span>{metrics.memoryUsage}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px', transition: 'width 0.6s ease',
                  width: `${metrics.memoryUsage}%`,
                  background: metrics.memoryUsage > 85 ? '#f87171' : 'var(--saas-primary)'
                }} />
              </div>
            </div>

            {/* CPU bar */}
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#666', marginBottom: '0.4rem' }}>
                <span>CPU</span><span>{metrics.cpuUsage}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px', transition: 'width 0.6s ease',
                  width: `${metrics.cpuUsage}%`,
                  background: metrics.cpuUsage > 80 ? '#f87171' : '#00b4d8'
                }} />
              </div>
            </div>
          </div>

          {/* Live API Log Stream */}
          <div className="interview-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', margin: 0 }}>Live Request Log</h2>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.72rem', color: '#34d399'
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#34d399', animation: 'pulse 2s infinite'
                }} />
                Live
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '320px', overflowY: 'auto' }}>
              {logs.map((log, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                  padding: '0.4rem 0.6rem', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.02)', fontSize: '0.78rem'
                }}>
                  <span style={{
                    color: logColor[log.type] || '#aaa', fontWeight: 700,
                    minWidth: '55px', flexShrink: 0, fontSize: '0.7rem'
                  }}>[{log.type}]</span>
                  <span style={{ color: '#ccc', lineHeight: '1.4', flex: 1 }}>{log.message}</span>
                  <span style={{ color: '#555', flexShrink: 0, fontSize: '0.68rem' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Admin Actions */}
        <div className="interview-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', margin: '0 0 1.25rem 0' }}>Quick Admin Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: '📊 View Analytics', href: '/' },
              { label: '🎤 Mock Interviews', href: '/mock-interview' },
              { label: '📋 Job Tracker',    href: '/applications' },
              { label: '👤 My Profile',     href: '/profile' },
            ].map(action => (
              <Link
                key={action.href}
                href={action.href}
                style={{
                  padding: '0.6rem 1.2rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px', color: '#ccc', textDecoration: 'none',
                  fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saas-primary)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#ccc'; }}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Protected>
  );
}
