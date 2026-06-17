'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { startMockSession, getSubscription } from '@/services/saas.api';
import Protected from '@/components/Protected';

export default function MockInterviewConfig() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [interviewType, setInterviewType] = useState('technical');

  useEffect(() => {
    async function loadSubscription() {
      try {
        const data = await getSubscription();
        setSubscription(data.subscription);
      } catch (err) {
        console.error("Failed to load subscription status", err);
      } finally {
        setSubLoading(false);
      }
    }
    loadSubscription();
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      showToast("Please enter a target role.", "error");
      return;
    }
    setLoading(true);
    try {
      const data = await startMockSession({ role, experienceLevel, interviewType });
      showToast("Session generated! Get ready...", "success");
      router.push(`/mock-interview/session/${data.session._id}`);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to start interview session. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected>
      <div className="home-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <header className="page-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1>AI <span className="highlight">Mock Interview Simulator</span></h1>
          <p>Practice in an interactive environment. Choose your setting, toggle voice input, and get filler-word reports instantly.</p>
        </header>

        <div className="interview-card">
          <form onSubmit={handleStart}>
            <div className="interview-card__body" style={{ flexDirection: 'column', gap: '2rem', padding: '2.5rem' }}>
              
              {subscription && (
                <div className="info-box" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <p style={{ margin: 0 }}>Current Tier: <strong style={{ color: 'var(--saas-primary)' }}>{subscription.plan} Plan</strong></p>
                      {subscription.plan === 'FREE' && (
                        <p style={{ fontSize: '0.85rem', color: '#888', margin: '0.2rem 0 0 0' }}>Free plan users are limited to 3 sessions per month.</p>
                      )}
                    </div>
                    {subscription.plan === 'FREE' && (
                      <button type="button" onClick={() => router.push('/#pricing')} className="button primary-button" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Target Role Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  Target Job Title / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer, Product Manager"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                  required
                />
              </div>

              {/* Grid Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%' }}>
                
                {/* Experience Level */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      background: '#16161a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      outline: 'none',
                    }}
                  >
                    <option value="Junior">Junior (0-2 years)</option>
                    <option value="Mid">Mid (2-5 years)</option>
                    <option value="Senior">Senior (5-8 years)</option>
                    <option value="Lead">Lead / Staff (8+ years)</option>
                  </select>
                </div>

                {/* Interview Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Interview Type
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      background: '#16161a',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      outline: 'none',
                    }}
                  >
                    <option value="technical">Technical / Coding</option>
                    <option value="behavioral">Behavioral (STAR method)</option>
                    <option value="system-design">System Design</option>
                    <option value="hr">HR &amp; Fit</option>
                  </select>
                </div>

              </div>

            </div>

            <div className="interview-card__footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span className="footer-info">Runs Web Speech API voice metrics in browser.</span>
              <button
                type="submit"
                disabled={loading}
                className="generate-btn"
                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: '14px', height: '14px', marginRight: '0.5rem', borderWidth: '2px' }} />
                    Generating Session...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Start Interview Simulation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  );
}
