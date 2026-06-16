'use client';

import React from 'react';
import Link from 'next/link';

export default function Terms() {
    return (
        <div className="static-page">
            <Link href="/" className="back-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Home</span>
            </Link>
            
            <h1>Terms of Service</h1>
            <p>Last updated: June 16, 2026</p>
            
            <p>
                By registering an account and using the AI ATS Platform, you agree to comply with the terms and conditions outlined below.
            </p>
            
            <h2>1. Use of Services</h2>
            <p>
                This platform provides candidate resume alignment scoring, interview strategy analysis, and mock interview preparations. You agree not to upload fraudulent documents, engage in automated request scraping, or exploit the LLM resources.
            </p>
            
            <h2>2. Generated Materials</h2>
            <p>
                All report outputs (questions, roadmaps, and generated resume templates) are tools provided to assist your job search. We make no guarantees regarding callbacks, hiring success, or correctness of generated technical items.
            </p>

            <h2>3. Limitation of Liability</h2>
            <p>
                The AI ATS Platform is not responsible for any outcome related to database downtime, API latency spikes, or accuracy variances in generated content.
            </p>

            <h2>4. Revisions to Terms</h2>
            <p>
                We reserve the right to modify these terms at any time. Your continued usage of the dashboard signifies approval of the updated policy agreements.
            </p>
        </div>
    );
}
