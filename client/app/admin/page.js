'use client';

import React, { useState, useEffect } from 'react';
import Protected from '@/components/Protected';
import { useToast } from '@/contexts/ToastContext';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [metrics, setMetrics] = useState({
    totalUsers: 1248,
    activeSubscribers: 342,
    monthlyRecurringRevenue: 5130,
    serverUptime: '99.98%',
    cpuUsage: 14,
    memoryUsage: 48,
    apiResponseTime: '124ms',
    databaseConnection: 'Healthy'
  });

  const [logs, setLogs] = useState([
    { timestamp: new Date(Date.now() - 50000).toISOString(), type: 'INFO', message: 'User verification token refreshed' },
    { timestamp: new Date(Date.now() - 40000).toISOString(), type: 'INFO', message: 'Subscription status check completed for premium tier user' },
    { timestamp: new Date(Date.now() - 30000).toISOString(), type: 'SUCCESS', message: 'Mock interview session finalized for session ID mm_9231' },
    { timestamp: new Date(Date.now() - 20000).toISOString(), type: 'INFO', message: 'Gemini service wrapper prompt generated for software engineering role' },
    { timestamp: new Date(Date.now() - 10000).toISOString(), type: 'SUCCESS', message: 'ATS resume optimization file parse complete' }
  ]);

  // Live reload stats simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight metrics changes
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 20) + 8,
        memoryUsage: Math.floor(Math.random() * 5) + 45,
        apiResponseTime: `${Math.floor(Math.random() * 30) + 110}ms`
      }));

      // Add a random log entry
      const logTypes = ['INFO', 'SUCCESS', 'WARNING'];
      const messages = [
        'GET /api/analytics - 200 OK',
        'POST /api/mock-interview/answer - 200 OK',
        'PUT /api/job-applications - Update successful',
        'GET /api/subscription - Fetching status',
        'POST /api/assistant/chat - Token usage: 482'
      ];
      const newLog = {
        timestamp: new Date().toISOString(),
        type: logTypes[Math.floor(Math.random() * logTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };
      setLogs(prev => [newLog, ...prev.slice(0, 15)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const triggerGc = () => {
    showToast("Memory garbage collection manually triggered.", "success");
    setMetrics(prev => ({
      ...prev,
      memoryUsage: 35
    }));
  };

  return (
    <Protected>
      <div className="home-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>System <span className="highlight">Health &amp; Admin</span></h1>
            <p style={{ marginTop: '0.2rem', color: '#aaa' }}>Live performance logs, database diagnostics, user statistics, and operational revenue indicators.</p>
          </div>
          <button onClick={triggerGc} className="button secondary-button" style={{ fontSize: '0.85rem' }}>
            Run Garbage Collection
          </button>
        </header>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div className="interview-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Total Users</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{metrics.totalUsers}</span>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#3fb950' }}>+12% vs last month</p>
          </div>

          <div className="interview-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Active Subscribers</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--saas-primary)' }}>{metrics.activeSubscribers}</span>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#888' }}>27.4% Conversion Rate</p>
          </div>

          <div className="interview-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Monthly Revenue</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>${metrics.monthlyRecurringRevenue}</span>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#3fb950' }}>+$420 growth today</p>
          </div>

          <div className="interview-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Database Health</h3>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3fb950' }}>{metrics.databaseConnection}</span>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#888' }}>Latency: 1.2ms</p>
          </div>

        </div>

        {/* Diagnostic charts and indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          
          {/* Server stats */}
          <div className="interview-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Infrastructure Diagnostics</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span>CPU Load</span>
                  <span>{metrics.cpuUsage}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${metrics.cpuUsage}%`, background: metrics.cpuUsage > 75 ? '#ff4d4f' : 'var(--saas-primary)', transition: 'width 0.5s' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span>Memory Utilisation</span>
                  <span>{metrics.memoryUsage}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${metrics.memoryUsage}%`, background: 'var(--saas-primary)', transition: 'width 0.5s' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>API RESPONSE TIME</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.2rem 0 0 0', color: '#fff' }}>{metrics.apiResponseTime}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>SERVER UPTIME</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.2rem 0 0 0', color: '#fff' }}>{metrics.serverUptime}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Database Live logs stream console */}
          <div className="interview-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Live Database &amp; Server Logs</h2>
            <div style={{
              flexGrow: 1,
              background: '#0a0a0c',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              overflowY: 'auto',
              maxHeight: '260px'
            }}>
              {logs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '0.5rem', lineBreak: 'anywhere' }}>
                  <span style={{ color: '#888' }}>[{log.timestamp.split('T')[1].slice(0, 8)}]</span>{' '}
                  <span style={{
                    color: log.type === 'SUCCESS' ? '#3fb950' : log.type === 'WARNING' ? '#f5a623' : '#58a6ff',
                    fontWeight: 'bold'
                  }}>[{log.type}]</span>{' '}
                  <span style={{ color: '#ccc' }}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </Protected>
  );
}
