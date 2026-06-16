'use client';

import React from 'react';
import Link from 'next/link';

export default function Help() {
    return (
        <div className="static-page">
            <Link href="/" className="back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Home</span>
            </Link>
            
            <h1>Help Center</h1>
            <p>Welcome to our support center. Find answers to frequently asked questions below.</p>
            
            <h2>1. How does the Match Score work?</h2>
            <p>
                Our AI model compares the text extracted from your resume and your self-description against the target job description. It rates your alignment out of 100 based on core skills, keyword frequency, and experience levels required.
            </p>
            
            <h2>2. What formats are supported for resume uploads?</h2>
            <p>
                We accept PDF and DOCX formats up to 5MB. For best results, use standard, text-based PDF formats rather than image scans so that our parser can successfully read the document text.
            </p>

            <h2>3. Can I download the customized resume?</h2>
            <p>
                Yes! When viewing your custom interview strategy report, click the "Download Resume" button in the left sidebar. The system automatically compiles an ATS-friendly HTML template and renders it to a downloadable PDF using Puppeteer.
            </p>

            <h2>4. What if my generated arrays are empty?</h2>
            <p>
                If your report displays 0 questions or no roadmap steps, it represents database records created before our major Gemini AI schema update. Create a new plan by pasting a fresh job description and self-description/resume, and it will generate all items correctly.
            </p>

            <h2>5. Still have questions?</h2>
            <p>
                If you encounter any bugs, system errors, or have inquiries, contact us via email at <strong>support@ai-ats-strategy.com</strong>.
            </p>
        </div>
    );
}
