'use client';

import React, { useState } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { analyzeResume } from '@/services/saas.api';
import Protected from '@/components/Protected';
import Link from 'next/link';

export default function ResumeAnalyzer() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size exceeds 5MB limit.", "error");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      showToast("Please enter a target job description.", "error");
      return;
    }

    if (inputMode === 'file' && !resumeFile) {
      showToast("Please upload a resume file.", "error");
      return;
    }

    if (inputMode === 'text' && !resumeText.trim()) {
      showToast("Please paste your resume text.", "error");
      return;
    }

    setLoading(true);
    try {
      let data;
      if (inputMode === 'file') {
        // We will call the backend multipart/form-data upload
        // In saas.api.js analyzeResume(resumeFile) only accepts resumeFile, but backend expects both. Let's make sure we pass the job description as well.
        // Wait, let's update the API request in saas.api.js to accept both if we need, or construct it directly here.
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("jobDescription", jobDescription);
        
        // Directly fetch using Axios or our Axios instance from saas.api.js
        // Let's import axios and send the request
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const axios = require('axios');
        const response = await axios.post(`${apiBaseUrl}/api/resume/analyze`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        });
        data = response.data;
      } else {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const axios = require('axios');
        const response = await axios.post(`${apiBaseUrl}/api/resume/analyze`, {
          resumeText,
          jobDescription
        }, {
          withCredentials: true
        });
        data = response.data;
      }
      
      setReport(data.report);
      showToast("Resume analysis completed!", "success");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to analyze resume. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  return (
    <Protected>
      <div className="home-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <header className="page-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1>AI Resume <span className="highlight">ATS Analyzer</span></h1>
          <p>Scan your resume against any target job description. Uncover formatting issues, missing keywords, and weak bullet points instantly.</p>
        </header>

        {!report ? (
          <div className="interview-card" style={{ padding: '2rem' }}>
            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Job Description Textarea */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                  Target Job Description <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  placeholder="Paste the full job description here to check ATS match..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '150px',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                  }}
                  required
                />
              </div>

              {/* Input mode selection */}
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setInputMode('file')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: inputMode === 'file' ? '2px solid var(--saas-primary)' : '2px solid transparent',
                    color: inputMode === 'file' ? '#fff' : '#888',
                    padding: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Upload PDF Resume
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: inputMode === 'text' ? '2px solid var(--saas-primary)' : '2px solid transparent',
                    color: inputMode === 'text' ? '#fff' : '#888',
                    padding: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Paste Resume Text
                </button>
              </div>

              {/* Resume File Upload dropzone */}
              {inputMode === 'file' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="dropzone" htmlFor="resume-file" style={{ cursor: 'pointer' }}>
                    <span className="dropzone__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </span>
                    <p className="dropzone__title">
                      {resumeFile ? resumeFile.name : "Click to upload your resume PDF"}
                    </p>
                    <p className="dropzone__subtitle">PDF format only (Max 5MB)</p>
                    <input
                      type="file"
                      id="resume-file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      hidden
                    />
                  </label>
                </div>
              ) : (
                /* Resume Text Area */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Paste Resume Content
                  </label>
                  <textarea
                    placeholder="Paste the plain text of your resume..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                    }}
                  />
                </div>
              )}

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
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      Scan Resume Match
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Report Results Display */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left Column: Recommendations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Weak Bullet Points Before/After slider cards */}
              <div className="interview-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saas-primary)" strokeWidth="2.5">
                    <polyline points="23 4 12.45 14.54 8 10 1 17" />
                    <polyline points="17 4 23 4 23 10" />
                  </svg>
                  Bullet Points Optimization (Before / After)
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {report.weakBulletPoints && report.weakBulletPoints.length > 0 ? (
                    report.weakBulletPoints.map((bp, idx) => {
                      // We can implement an interactive toggle slider state per bullet point
                      return (
                        <div key={idx} className="interview-card" style={{ padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0, 0, 0, 0.15)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.05)', paddingRight: '1rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#ff4d4f', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Original (Weak)</span>
                              <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>"{bp.before}"</p>
                            </div>
                            <div style={{ position: 'relative' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#3fb950', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Optimized (Strong)</span>
                              <p style={{ color: '#fff', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>"{bp.after}"</p>
                              <button
                                onClick={() => copyToClipboard(bp.after)}
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  background: 'rgba(255,255,255,0.05)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '0.2rem 0.4rem',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem'
                                }}
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: '#888', margin: 0 }}>No weak bullet points were identified! Nice job.</p>
                  )}
                </div>
              </div>

              {/* Formatting Issues */}
              <div className="interview-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  ATS Formatting Concerns
                </h2>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#ccc', lineHeight: '1.6' }}>
                  {report.formattingProblems && report.formattingProblems.length > 0 ? (
                    report.formattingProblems.map((prob, idx) => (
                      <li key={idx} style={{ marginBottom: '0.5rem' }}>{prob}</li>
                    ))
                  ) : (
                    <li style={{ color: '#3fb950', listStyleType: 'none', marginLeft: '-1.2rem' }}>✓ No critical formatting issues found. Perfect for ATS parsing!</li>
                  )}
                </ul>
              </div>

              {/* Experience quality report */}
              <div className="interview-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--saas-primary)" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Executive Feedback &amp; Context
                </h2>
                <p style={{ color: '#ccc', lineHeight: '1.6', margin: 0 }}>
                  {report.experienceQualityReport || 'No additional summary text available.'}
                </p>
              </div>

            </div>

            {/* Right Column: Score & Keywords */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* ATS score widget */}
              <div className="match-score-widget">
                <p className="match-score-widget__label">ATS Match Score</p>
                <div className={`match-score-widget__ring ${report.atsScore >= 80 ? 'score--high' : report.atsScore >= 60 ? 'score--mid' : 'score--low'}`}>
                  <span className="match-score-widget__value">{report.atsScore || 0}</span>
                  <span className="match-score-widget__pct">%</span>
                </div>
                <p className="match-score-widget__sub">Score calculated from keyword alignment.</p>
              </div>

              {/* Missing keywords list */}
              <div className="interview-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: '#888', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Missing Keywords</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {report.missingKeywords && report.missingKeywords.length > 0 ? (
                    report.missingKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(245, 166, 35, 0.1)',
                          border: '1px solid rgba(245, 166, 35, 0.2)',
                          color: '#f5a623',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#3fb950', fontSize: '0.9rem' }}>✓ All critical job-description keywords are present!</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setReport(null)}
                className="button primary-button"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                Scan Another Resume
              </button>

            </div>

          </div>
        )}

      </div>
    </Protected>
  );
}
