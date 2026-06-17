'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInterview } from '../hooks/useInterview';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAnalytics, upgradeSubscription } from '../services/saas.api';

// ── Upgraded Landing Page Sub-Component ──
const LandingPage = ({ showToast }) => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
    const [faqOpen, setFaqOpen] = useState({});

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        setNewsletterSubmitted(true);
        showToast("You're subscribed! Watch your inbox for updates.", 'success');
        setTimeout(() => {
            setNewsletterSubmitted(false);
            setNewsletterEmail('');
        }, 3000);
    };

    const toggleFaq = (index) => {
        setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleSimulatedUpgrade = async (plan) => {
        showToast(`Upgrading to ${plan}... Redirecting to auth.`, 'info');
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">All-In-One Career Copilot Platform</span>
                    <h1 className="hero-title">Supercharge Your Career Prep with <span className="highlight">MockMate.AI</span></h1>
                    <p className="hero-desc">
                        MockMate is a comprehensive SaaS platform built to land your dream job. Optimize resumes, simulate speech-driven mock interviews, track job pipelines, and get feedback from our AI Coach.
                    </p>
                    <div className="hero-actions">
                        <Link href="/register" className="button primary-button hero-cta-btn">Get Started Free</Link>
                        <a href="#features" className="button secondary-button hero-sec-btn">Explore Features</a>
                    </div>
                </div>
                <div className="hero-preview">
                    {/* Visual mockup of the app dashboard widgets */}
                    <div className="preview-card">
                        <div className="preview-header">
                            <span className="preview-dot red"></span>
                            <span className="preview-dot yellow"></span>
                            <span className="preview-dot green"></span>
                            <span className="preview-title">SaaS Copilot Workspace</span>
                        </div>
                        <div className="preview-body">
                            <div className="preview-sidebar" style={{ width: '40%' }}>
                                <div className="preview-score-widget">
                                    <div className="preview-score-ring">94%</div>
                                    <div className="preview-score-label">Resume Match</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#ff4d4f' }}>✗ Missing "Zustand"</span>
                                    <span style={{ fontSize: '0.75rem', color: '#3fb950' }}>✓ Found "Next.js"</span>
                                </div>
                            </div>
                            <div className="preview-content">
                                <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.5rem', background: 'rgba(0,0,0,0.1)' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold' }}>Mock Interview Session</p>
                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#aaa' }}>Speech filler-words count: 1</p>
                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#3fb950' }}>Overall Score: 88/100</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section id="features" className="features-section">
                <span className="section-tag">Feature Suite</span>
                <h2 className="section-title">Engineered For Dynamic Preparation</h2>
                <p className="section-desc">Get access to professional modules optimized to maximize interview conversions.</p>
                
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-card__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--saas-primary)" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </div>
                        <h3 className="feature-card__title">Interactive Voice Simulator</h3>
                        <p className="feature-card__desc">Simulate realistic hiring rounds. Practice using voice transcription, pacing analyzers, and filler-word flags in real time.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--saas-primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        </div>
                        <h3 className="feature-card__title">ATS Resume Audits</h3>
                        <p className="feature-card__desc">Scan keywords, evaluate formatting, and view interactive side-by-side Before/After metric bullet points optimization.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--saas-primary)" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        </div>
                        <h3 className="feature-card__title">Job Application Kanban</h3>
                        <p className="feature-card__desc">Track job pipeline milestones with drag-and-drop column boards (Saved, Applied, Interview, Offer, Rejected).</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--saas-primary)" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                        </div>
                        <h3 className="feature-card__title">Context Career Coach</h3>
                        <p className="feature-card__desc">Directly query our AI Coach workspace. Gets automated access to your database profile gaps to answer questions intelligently.</p>
                    </div>
                </div>
            </section>

            {/* Meet the Career Coach Section */}
            <section style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 350px' }}>
                        <span className="section-tag">Expert Coach</span>
                        <h2 className="section-title" style={{ textAlign: 'left', margin: '0.5rem 0' }}>Dynamic Learning &amp; Mentoring</h2>
                        <p className="section-desc" style={{ textAlign: 'left', padding: 0 }}>
                            MockMate's AI Career Coach is trained on top-tier engineering rubrics, Google tech standards, and consulting case evaluations. It scans database profiles, tracks interview histories, and dynamically customizes recommendations to target role requirements.
                        </p>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ color: '#fff', fontSize: '1.2rem', display: 'block' }}>24/7</strong>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Realtime Advice Availability</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ color: '#fff', fontSize: '1.2rem', display: 'block' }}>Instant</strong>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>ATS Scan &amp; Keyword Check</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: '1 1 300px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--saas-primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>MM</div>
                            <div>
                                <h4 style={{ margin: 0, color: '#fff' }}>Official Career Coach</h4>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Powered by Gemini 2.5 Flash</span>
                            </div>
                        </div>
                        <p style={{ color: '#ccc', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                          "Let's look at your database gaps. I see React performance tuning was flagged as a missing skill in your latest resume upload. Should we build a study layout for React profiling tools?"
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section Grid */}
            <section id="pricing" style={{ padding: '5rem 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <span className="section-tag">Flexible Subscriptions</span>
                    <h2 className="section-title">Upgrade Your Prep Pipeline</h2>
                    <p className="section-desc">Unlock premium mock interview counts and continuous AI suggestions.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                        
                        {/* Free tier */}
                        <div className="interview-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Free Tier</h3>
                            <div style={{ margin: '1rem 0' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>$0</span>
                                <span style={{ color: '#888' }}> / month</span>
                            </div>
                            <ul style={{ textAlign: 'left', paddingLeft: '1rem', color: '#ccc', fontSize: '0.9rem', lineHeight: '1.8', flexGrow: 1 }}>
                                <li>3 Mock Interviews / Month</li>
                                <li>Basic Resume Match Score</li>
                                <li>Career Coach standard workspace</li>
                            </ul>
                            <Link href="/register" className="button secondary-button" style={{ marginTop: '1.5rem', display: 'block' }}>Get Started</Link>
                        </div>

                        {/* Pro tier */}
                        <div className="interview-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '2px solid var(--saas-primary)', position: 'relative' }}>
                            <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--saas-primary)', color: '#000', fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 10px', borderRadius: '10px' }}>POPULAR</span>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>PRO Plan</h3>
                            <div style={{ margin: '1rem 0' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>$19</span>
                                <span style={{ color: '#888' }}> / month</span>
                            </div>
                            <ul style={{ textAlign: 'left', paddingLeft: '1rem', color: '#ccc', fontSize: '0.9rem', lineHeight: '1.8', flexGrow: 1 }}>
                                <li>Unlimited Speech Simulation</li>
                                <li>Advanced ATS Keyword Reports</li>
                                <li>Detailed Before/After Optimizations</li>
                                <li>Priority Career Chatbot &amp; Coaching</li>
                            </ul>
                            <button onClick={() => handleSimulatedUpgrade('PRO')} className="button primary-button" style={{ marginTop: '1.5rem', display: 'block', width: '100%' }}>Upgrade to Pro</button>
                        </div>

                        {/* Enterprise tier */}
                        <div className="interview-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Enterprise Plan</h3>
                            <div style={{ margin: '1rem 0' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>$49</span>
                                <span style={{ color: '#888' }}> / month</span>
                            </div>
                            <ul style={{ textAlign: 'left', paddingLeft: '1rem', color: '#ccc', fontSize: '0.9rem', lineHeight: '1.8', flexGrow: 1 }}>
                                <li>Everything in Pro</li>
                                <li>Multi-profile team logins</li>
                                <li>Custom corporate training cases</li>
                                <li>Dedicated account support</li>
                            </ul>
                            <button onClick={() => handleSimulatedUpgrade('ENTERPRISE')} className="button secondary-button" style={{ marginTop: '1.5rem', display: 'block', width: '100%' }}>Upgrade Enterprise</button>
                        </div>

                    </div>
                </div>
            </section>

            {/* FAQ Accordion Section */}
            <section style={{ padding: '5rem 2rem', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <span className="section-tag" style={{ display: 'block', textAlign: 'center' }}>Got Questions?</span>
                    <h2 className="section-title" style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3rem' }}>
                        {[
                          { q: "How does the Speech Simulator track filler words?", a: "We run standard Web Speech API transcription on the browser, and then process the raw audio outputs to compute pacing, pauses, and flag typical fillers like 'um', 'ah', 'like', and 'basically'." },
                          { q: "Can I use MockMate without uploading a resume?", a: "Yes! You can manually paste a Quick Self-Description or outline target competencies directly to get dynamic questions generated for you." },
                          { q: "How accurate is the ATS match score?", a: "We leverage Gemini 2.5 models comparing your resume keywords directly with the semantic contexts of target job descriptions to calculate true compatibility percentage score." }
                        ].map((faq, idx) => (
                          <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem', overflow: 'hidden' }}>
                            <button
                              onClick={() => toggleFaq(idx)}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                textAlign: 'left'
                              }}
                            >
                              <span>{faq.q}</span>
                              <span>{faqOpen[idx] ? '−' : '+'}</span>
                            </button>
                            {faqOpen[idx] && (
                              <p style={{ margin: '0.75rem 0 0 0', color: '#bbb', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                {faq.a}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section">
                <div className="newsletter-container">
                    <div className="newsletter-content">
                        <span className="section-tag">Newsletter</span>
                        <h2 className="section-title">Stay Ahead of the Curve</h2>
                        <p className="newsletter-desc">
                            Subscribe to our newsletter to receive the latest interview strategies, resume tailoring tips, and industry trends directly in your inbox.
                        </p>
                    </div>
                    <div className="newsletter-form-container">
                        {newsletterSubmitted ? (
                            <div className="newsletter-success">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <h4>Thanks for subscribing!</h4>
                                <p>You'll receive our next issue soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                                <input 
                                    type="email" 
                                    required 
                                    value={newsletterEmail} 
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Enter your email address" 
                                    className="newsletter-input"
                                />
                                <button type="submit" className="button primary-button newsletter-btn">
                                    Subscribe
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

// ── Main Dashboard / Page Component ──
export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const { loading: interviewLoading, generateReport, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef(null);
    const router = useRouter();
    const { showToast } = useToast();

    // Stats widgets states
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'create-plan'

    // Load user analytics stats
    useEffect(() => {
        if (!user) return;
        async function fetchStats() {
            try {
                const data = await getAnalytics();
                setStats(data);
            } catch (err) {
                console.error("Failed to load analytics dashboard stats", err);
            } finally {
                setStatsLoading(false);
            }
        }
        fetchStats();
    }, [user]);

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files?.[0];
        const data = await generateReport({ jobDescription, selfDescription, resumeFile });
        if (data && data._id) {
            router.push(`/interview/${data._id}`);
        }
    };

    if (authLoading) {
        return (
            <main className='loading-screen'>
                <div className="spinner" />
                <p>Loading...</p>
            </main>
        );
    }

    if (interviewLoading) {
        return (
            <main className='loading-screen'>
                <div className="spinner" />
                <p>Generating your interview strategy...</p>
            </main>
        );
    }

    // Render Landing Page if User is not logged in
    if (!user) {
        return <LandingPage showToast={showToast} />;
    }

    return (
        <div className='home-page' style={{ paddingBottom: '3rem' }}>
            
            {/* Quick Action Navigation Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/mock-interview" className="interview-card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', hover: { borderColor: 'var(--saas-primary)' } }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>🎙️</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Mock Simulator</strong>
                </Link>
                <Link href="/resume-analyzer" className="interview-card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>📄</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Resume Scan</strong>
                </Link>
                <Link href="/linkedin-analyzer" className="interview-card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>🔗</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>LinkedIn Audit</strong>
                </Link>
                <Link href="/applications" className="interview-card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>📋</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Job Tracker</strong>
                </Link>
                <Link href="/assistant" className="interview-card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>💬</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Career Coach</strong>
                </Link>
                <Link href="/admin" className="interview-card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.25rem' }}>⚙️</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Admin Stats</strong>
                </Link>
            </div>

            {/* Tab Selection */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', gap: '1.5rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setActiveTab('dashboard')}
                style={{
                  padding: '0.75rem 0.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'dashboard' ? '2px solid var(--saas-primary)' : '2px solid transparent',
                  color: activeTab === 'dashboard' ? '#fff' : '#888',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                Gamification &amp; Stats
              </button>
              <button
                onClick={() => setActiveTab('create-plan')}
                style={{
                  padding: '0.75rem 0.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'create-plan' ? '2px solid var(--saas-primary)' : '2px solid transparent',
                  color: activeTab === 'create-plan' ? '#fff' : '#888',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                Create Strategy Plan
              </button>
            </div>

            {activeTab === 'dashboard' ? (
                /* Stats and Gamification view */
                <div>
                  {!statsLoading && stats ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                      
                      {/* Left: Progression and Applications */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* Level Progression */}
                        <div className="interview-card" style={{ padding: '2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>My Learning Progression</h2>
                            <span style={{ fontSize: '0.9rem', color: 'var(--saas-primary)', fontWeight: 'bold' }}>Level {stats.level}</span>
                          </div>
                          
                          {/* Progress bar */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.5rem' }}>
                              <span>XP: {stats.xp} pts</span>
                              <span>Next Level: {Math.ceil(stats.xp / 1000) * 1000} XP</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${(stats.xp % 1000) / 10}%`, background: 'var(--saas-primary)', transition: 'width 0.5s' }} />
                            </div>
                          </div>

                          {/* Badges list */}
                          <div style={{ marginTop: '2rem' }}>
                            <h3 style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Earned Badges</h3>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              {stats.badges && stats.badges.length > 0 ? (
                                stats.badges.map((badge, i) => (
                                  <div
                                    key={i}
                                    title={badge.description}
                                    style={{
                                      background: 'rgba(255,255,255,0.03)',
                                      border: '1px solid rgba(255,255,255,0.06)',
                                      borderRadius: '8px',
                                      padding: '0.5rem 1rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem'
                                    }}
                                  >
                                    <span style={{ fontSize: '1.2rem' }}>{badge.icon || '🏅'}</span>
                                    <div>
                                      <strong style={{ fontSize: '0.8rem', color: '#fff', display: 'block' }}>{badge.name}</strong>
                                      <span style={{ fontSize: '0.7rem', color: '#888' }}>Earned {new Date(badge.dateEarned).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Complete mock rounds to unlock your first badges!</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Job Applications Track Summary */}
                        <div className="interview-card" style={{ padding: '2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Pipeline Tracker Breakdown</h2>
                            <Link href="/applications" style={{ fontSize: '0.85rem', color: 'var(--saas-primary)' }}>Manage Boards →</Link>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', textAlign: 'center' }}>
                            {['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'].map((status) => {
                              const count = stats.jobStats?.[status] || 0;
                              return (
                                <div key={status} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.75rem 0.5rem' }}>
                                  <strong style={{ fontSize: '1.5rem', color: '#fff', display: 'block' }}>{count}</strong>
                                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>{status}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Right: Scores & Performance */}
                      <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* ATS Score widget */}
                        <div className="match-score-widget">
                          <p className="match-score-widget__label">Latest ATS Score</p>
                          <div className={`match-score-widget__ring ${stats.latestResumeScore >= 80 ? 'score--high' : stats.latestResumeScore >= 60 ? 'score--mid' : 'score--low'}`}>
                            <span className="match-score-widget__value">{stats.latestResumeScore || 0}</span>
                            <span className="match-score-widget__pct">%</span>
                          </div>
                          <p className="match-score-widget__sub">Upload your resume to check keywords match.</p>
                        </div>

                        {/* Interview performance averages */}
                        <div className="interview-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', margin: 0 }}>Simulator Scores</h3>
                          
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#ccc', marginBottom: '0.25rem' }}>
                              <span>Technical Interviews</span>
                              <span>{stats.interviewPerformance?.technical}%</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${stats.interviewPerformance?.technical}%`, background: 'var(--saas-primary)' }} />
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#ccc', marginBottom: '0.25rem' }}>
                              <span>Behavioral Interviews</span>
                              <span>{stats.interviewPerformance?.behavioral}%</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${stats.interviewPerformance?.behavioral}%`, background: 'var(--saas-primary)' }} />
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#ccc', marginBottom: '0.25rem' }}>
                              <span>HR Interviews</span>
                              <span>{stats.interviewPerformance?.hr}%</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${stats.interviewPerformance?.hr}%`, background: 'var(--saas-primary)' }} />
                            </div>
                          </div>

                        </div>

                      </aside>

                    </div>
                  ) : (
                    <main className="loading-screen" style={{ height: '300px' }}>
                      <div className="spinner" />
                      <p>Compiling stats metrics...</p>
                    </main>
                  )}
                </div>
            ) : (
                /* Original plan generator view */
                <div>
                  {/* Page Header */}
                  <header className='page-header'>
                      <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                      <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
                  </header>

                  {/* Main Card */}
                  <div className='interview-card'>
                      <div className='interview-card__body'>
                          {/* Left Panel - Job Description */}
                          <div className='panel panel--left'>
                              <div className='panel__header'>
                                  <span className='panel__icon'>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                      </svg>
                                  </span>
                                  <h2>Target Job Description</h2>
                                  <span className='badge badge--required'>Required</span>
                              </div>
                              <textarea
                                  onChange={(e) => { setJobDescription(e.target.value); }}
                                  className='panel__textarea'
                                  placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                                  maxLength={5000}
                                  value={jobDescription}
                              />
                              <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                          </div>

                          {/* Vertical Divider */}
                          <div className='panel-divider' />

                          {/* Right Panel - Profile */}
                          <div className='panel panel--right'>
                              <div className='panel__header'>
                                  <span className='panel__icon'>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                          <circle cx="12" cy="7" r="4" />
                                      </svg>
                                  </span>
                                  <h2>Your Profile</h2>
                              </div>

                              {/* Upload Resume */}
                              <div className='upload-section'>
                                  <label className='section-label'>
                                      Upload Resume
                                      <span className='badge badge--best'>Best Results</span>
                                  </label>
                                  <label className='dropzone' htmlFor='resume'>
                                      <span className='dropzone__icon'>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                              <polyline points="16 16 12 12 8 16" />
                                              <line x1="12" y1="12" x2="12" y2="21" />
                                              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                                          </svg>
                                      </span>
                                      <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                      <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                      <input ref={resumeInputRef} hidden type='file' id='resume' name='resume' accept='.pdf,.docx' />
                                  </label>
                              </div>

                              {/* OR Divider */}
                              <div className='or-divider'><span>OR</span></div>

                              {/* Quick Self-Description */}
                              <div className='self-description'>
                                  <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                                  <textarea
                                      onChange={(e) => { setSelfDescription(e.target.value); }}
                                      id='selfDescription'
                                      name='selfDescription'
                                      className='panel__textarea panel__textarea--short'
                                      placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                      value={selfDescription}
                                  />
                              </div>

                              {/* Info Box */}
                              <div className='info-box'>
                                  <span className='info-box__icon'>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                          <circle cx="12" cy="12" r="10" />
                                          <line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" />
                                          <line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" />
                                      </svg>
                                  </span>
                                  <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                              </div>
                          </div>
                      </div>

                      {/* Card Footer */}
                      <div className='interview-card__footer'>
                          <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                          <button
                              onClick={handleGenerateReport}
                              className='generate-btn'>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                              </svg>
                              Generate My Interview Strategy
                          </button>
                      </div>
                  </div>

                  {/* Recent Reports List */}
                  {reports && reports.length > 0 && (
                      <section className='recent-reports' style={{ marginTop: '3rem' }}>
                          <h2>My Recent Interview Plans</h2>
                          <ul className='reports-list'>
                              {reports.map(report => (
                                  <li key={report._id} className='report-item' onClick={() => router.push(`/interview/${report._id}`)}>
                                      <h3>{report.title || 'Untitled Position'}</h3>
                                      <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                      <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                                  </li>
                              ))}
                          </ul>
                      </section>
                  )}
                </div>
            )}
        </div>
    );
}
