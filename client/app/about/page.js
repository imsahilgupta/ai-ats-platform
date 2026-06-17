import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "About Us - MockMate.AI",
  description: "Learn more about MockMate.AI's AI-Powered Applicant Tracking System (ATS) preparation strategies.",
};

export default function AboutPage() {
    return (
        <div className="landing-page" style={{ gap: '4rem' }}>
            <Link href="/" className="back-btn" style={{ marginBottom: '-2rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Home</span>
            </Link>

            {/* About Section */}
            <section className="about-section">
                <div className="about-grid">
                    <div className="about-content">
                        <span className="section-tag">About System</span>
                        <h2 className="section-title">Designed for Job Seekers & Career Changers</h2>
                        <p className="about-desc">
                            The AI ATS Strategy Platform bridges the gap between candidates and rigid applicant tracking systems. Instead of guessing why you aren't getting callbacks, our AI runs deep analyses of skills, keyword frequencies, and role intentions to prepare you for interviews.
                        </p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-num">30s</span>
                                <span className="stat-label">Analysis Time</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">100%</span>
                                <span className="stat-label">Tailored Strategy</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-num">10k+</span>
                                <span className="stat-label">Reports Generated</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
