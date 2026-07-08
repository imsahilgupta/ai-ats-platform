'use client';

import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { analyzeLinkedin } from '@/services/saas.api';
import Protected from '@/components/Protected';

export default function LinkedinAnalyzer() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [profileText, setProfileText] = useState('');

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!profileText.trim()) {
      showToast("Please paste your LinkedIn profile contents.", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await analyzeLinkedin(profileText);
      setReport(data.report);
      showToast("LinkedIn optimizations generated!", "success");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to analyze profile. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied text to clipboard!", "success");
  };

  return (
    <Protected>
      <div className="home-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <header className="page-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1>AI LinkedIn <span className="highlight">Profile Optimizer</span></h1>
          <p>Supercharge your professional brand. Input your current headline and summary details to generate attention-grabbing headline variants and a premium "About" copy.</p>
        </header>

        {!report ? (
          <div className="interview-card" style={{ padding: '2rem' }}>
            <form onSubmit={handleOptimize} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  Your Current LinkedIn Profile Details
                </label>
                <textarea
                  placeholder={`Paste your current LinkedIn headline, summary, and work experience here...\n\ne.g.,\nHeadline: Software Engineer at Acme Corp\nAbout: I build web applications using React and Node.js. Looking for new opportunities...\nExperience:\nSoftware Engineer at Acme Corp (2023 - Present)\nBuilt user interfaces and APIs...`}
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '250px',
                    padding: '1rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="generate-btn"
                  style={{ width: 'auto', padding: '0.8rem 2rem' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ width: '14px', height: '14px', marginRight: '0.5rem', borderWidth: '2px' }} />
                      Auditing Profile...
                    </>
                  ) : (
                    <>
                      Generate Profile Suggestions
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            
            {/* Headlines Section */}
            <div className="interview-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Suggested LinkedIn Headlines
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {report.headlineSuggestions && report.headlineSuggestions.length > 0 ? (
                  report.headlineSuggestions.map((hl, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--info-bg)',
                        border: '1px solid var(--border-color)',
                        padding: '1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>{hl}</p>
                      <button
                        onClick={() => copyToClipboard(hl)}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          padding: '0.4rem 0.8rem',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          flexShrink: 0
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>No headline suggestions generated.</p>
                )}
              </div>
            </div>

            {/* About Page suggestions */}
            <div className="interview-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Optimized "About" Section
                </h2>
                <button
                  onClick={() => copyToClipboard(report.aboutSuggestions)}
                  style={{
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 1rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Copy Summary
                </button>
              </div>
              <div style={{
                background: 'var(--info-bg)',
                border: '1px solid var(--border-color)',
                padding: '1.5rem',
                borderRadius: '8px',
                lineHeight: '1.7',
                color: 'var(--text-muted)',
                fontSize: '1rem',
                whiteSpace: 'pre-wrap'
              }}>
                {report.aboutSuggestions || 'No summary optimization provided.'}
              </div>
            </div>

            {/* Experience-specific suggestions */}
            {report.experienceSuggestions && report.experienceSuggestions.length > 0 && (
              <div className="interview-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Experience Description Audit
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {report.experienceSuggestions.map((exp, idx) => (
                    <div
                      key={idx}
                      style={{
                        borderBottom: idx < report.experienceSuggestions.length - 1 ? '1px solid var(--border-color)' : 'none',
                        paddingBottom: idx < report.experienceSuggestions.length - 1 ? '1.5rem' : 0
                      }}
                    >
                      <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                        {exp.role} at <span style={{ color: 'var(--accent)' }}>{exp.company}</span>
                      </h4>
                      <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {exp.suggestions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setReport(null)}
                className="button secondary-button"
                style={{ padding: '0.75rem 2rem' }}
              >
                Scan Another Profile
              </button>
            </div>

          </div>
        )}

      </div>
    </Protected>
  );
}
