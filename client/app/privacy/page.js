'use client';

import React from 'react';
import Link from 'next/link';

export default function Privacy() {
    return (
        <div className="static-page">
            <Link href="/" className="back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Home</span>
            </Link>
            
            <h1>Privacy Policy</h1>
            <p>Last updated: June 16, 2026</p>
            
            <p>
                At AI ATS Platform, we value your privacy. This Privacy Policy details how we collect, store, process, and protect your information when you upload resumes and generate interview strategy preparation roadmaps.
            </p>
            
            <h2>1. Information We Collect</h2>
            <p>
                We collect information directly provided by you, including:
            </p>
            <ul>
                <li>Account credentials (username, email address, password hashes).</li>
                <li>Uploaded resumes (parsed texts, uploaded files).</li>
                <li>Self descriptions and target job descriptions.</li>
            </ul>

            <h2>2. How We Use Your Data</h2>
            <p>
                Your data is processed to:
            </p>
            <ul>
                <li>Generate tailored technical and behavioral questions via LLM APIs.</li>
                <li>Create custom skill gap analysis matrices.</li>
                <li>Design day-by-day learning roadmaps and compile resume templates to PDF formats.</li>
            </ul>

            <h2>3. Third-Party API Integrations</h2>
            <p>
                We utilize third-party generative models (including Google Gemini AI APIs) to analyze resume details and job requirements. These platforms do not utilize your personal data to train their models.
            </p>

            <h2>4. Security</h2>
            <p>
                We execute standard database encryption policies, secure cookie storage, and JWT token signatures to protect user accounts from unauthorized access.
            </p>
        </div>
    );
}
