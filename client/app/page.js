'use client';

import React, { useState, useRef } from 'react';
import { useInterview } from '../hooks/useInterview';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Landing Page Sub-Component ──
const LandingPage = ({ showToast }) => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        setNewsletterSubmitted(true);
        showToast("You're subscribed! Watch your inbox for updates.", 'success');
        setTimeout(() => {
            setNewsletterSubmitted(false);
            setNewsletterEmail('');
        }, 3000);
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">AI-Powered Job Preparation</span>
                    <h1 className="hero-title">Land Your Dream Job with <span className="highlight">ATS Strategy</span></h1>
                    <p className="hero-desc">
                        Analyze your resume against any target job description. Identify critical skill gaps, get tailored technical & behavioral questions, and follow a personalized day-by-day preparation roadmap.
                    </p>
                    <div className="hero-actions">
                        <Link href="/register" className="button primary-button hero-cta-btn">Get Started Free</Link>
                        <a href="#features" className="button secondary-button hero-sec-btn">Learn More</a>
                    </div>
                </div>
                <div className="hero-preview">
                    {/* Visual mockup of the app report view */}
                    <div className="preview-card">
                        <div className="preview-header">
                            <span className="preview-dot red"></span>
                            <span className="preview-dot yellow"></span>
                            <span className="preview-dot green"></span>
                            <span className="preview-title">MockMate.AI Report - Senior React Developer</span>
                        </div>
                        <div className="preview-body">
                            <div className="preview-sidebar">
                                <div className="preview-score-widget">
                                    <div className="preview-score-ring">85%</div>
                                    <div className="preview-score-label">Match Score</div>
                                </div>
                                <div className="preview-skills">
                                    <span className="preview-skill high">Zustand</span>
                                    <span className="preview-skill med">Next.js App Router</span>
                                    <span className="preview-skill low">Unit Testing</span>
                                </div>
                            </div>
                            <div className="preview-content">
                                <div className="preview-q-card">
                                    <div className="preview-q-header">Q1: How do you optimize Core Web Vitals in Next.js?</div>
                                    <div className="preview-q-body">
                                        Use dynamic imports, Image component, and font optimization...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <span className="section-tag">Features</span>
                <h2 className="section-title">Built to Accelerate Your Career</h2>
                <p className="section-desc">We leverage state-of-the-art AI models to dissect job descriptions and build custom preparation pipelines.</p>
                
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-card__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        </div>
                        <h3 className="feature-card__title">ATS Match Analysis</h3>
                        <p className="feature-card__desc">Get a detailed percentage match score showing how well your profile aligns with target roles.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <h3 className="feature-card__title">Tailored Question Banks</h3>
                        <p className="feature-card__desc">Custom technical and behavioral questions generated specifically for the job requirements, with detailed answers.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                        </div>
                        <h3 className="feature-card__title">Day-by-Day Roadmap</h3>
                        <p className="feature-card__desc">Follow a structured learning and practice plan designed to resolve your skill gaps before the interview.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-card__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                        <h3 className="feature-card__title">PDF Resume Tailoring</h3>
                        <p className="feature-card__desc">Instantly customize your resume for the target job and export a beautifully formatted, ATS-friendly PDF.</p>
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

// ── Main Page Component ──
export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const { loading: interviewLoading, generateReport, reports } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef(null);
    const router = useRouter();

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

    const { showToast } = useToast();

    // Render Landing Page if User is not logged in
    if (!user) {
        return <LandingPage showToast={showToast} />;
    }

    // Render Dashboard if User is logged in
    return (
        <div className='home-page'>
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
                <section className='recent-reports'>
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
    );
}

