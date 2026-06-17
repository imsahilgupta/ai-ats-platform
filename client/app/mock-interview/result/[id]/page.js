'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import { getMockResult } from '@/services/saas.api';
import Protected from '@/components/Protected';
import Link from 'next/link';

export default function MockInterviewResult() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const sessionId = params?.id;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'history'

  useEffect(() => {
    if (!sessionId) return;
    async function loadResult() {
      try {
        const data = await getMockResult(sessionId);
        setSession(data.session);
      } catch (err) {
        console.error(err);
        showToast("Failed to load interview results.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="spinner" />
        <p>Analyzing performance and loading metrics...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="loading-screen">
        <p>Session results not found.</p>
      </main>
    );
  }

  const overallScoreColor =
    session.overallScore >= 80 ? 'score--high' :
    session.overallScore >= 60 ? 'score--mid' : 'score--low';

  // Extract communication scores with defaults
  const comm = session.communicationScore || {
    confidence: 80,
    clarity: 80,
    fillerWordsCount: 0,
    pace: 'good'
  };

  // Build the list of Q&A rounds
  const rounds = [];
  let currentQuestion = "";
  session.chatHistory.forEach((item) => {
    if (item.role === 'interviewer') {
      currentQuestion = item.content;
    } else if (item.role === 'candidate') {
      rounds.push({
        question: currentQuestion,
        answer: item.content,
        score: item.evaluation?.score || 0,
        feedback: item.evaluation?.feedback || 'No feedback provided.'
      });
    }
  });

  return (
    <Protected>
      <div className="home-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Header Section */}
        <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1>Performance <span className="highlight">Scorecard</span></h1>
            <p style={{ marginTop: '0.2rem' }}>Detailed breakdown for your {session.role} mock interview.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/mock-interview" className="button secondary-button">
              New Session
            </Link>
            <Link href="/" className="button primary-button">
              Go to Home
            </Link>
          </div>
        </header>

        {/* Main scorecard layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', gap: '1.5rem' }}>
              <button
                onClick={() => setActiveTab('summary')}
                style={{
                  padding: '0.75rem 0.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'summary' ? '2px solid var(--saas-primary)' : '2px solid transparent',
                  color: activeTab === 'summary' ? '#fff' : '#888',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                Overall Review
              </button>
              <button
                onClick={() => setActiveTab('history')}
                style={{
                  padding: '0.75rem 0.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'history' ? '2px solid var(--saas-primary)' : '2px solid transparent',
                  color: activeTab === 'history' ? '#fff' : '#888',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                Round-by-Round Breakdown ({rounds.length})
              </button>
            </div>

            {/* Tab: Summary */}
            {activeTab === 'summary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* AI Review text */}
                <div className="interview-card" style={{ padding: '2rem' }}>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--saas-primary)" strokeWidth="2.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    AI Coach Evaluation Summary
                  </h2>
                  <div style={{ lineHeight: '1.7', color: '#ccc', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                    {session.feedbackReport || 'Review report is generating...'}
                  </div>
                </div>

                {/* Communication analytics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  
                  <div className="interview-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#888', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Filler Words Density</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: comm.fillerWordsCount > 4 ? '#ff4d4f' : '#3fb950' }}>
                        {comm.fillerWordsCount}
                      </span>
                      <span style={{ color: '#888' }}>words flagged</span>
                    </div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#bbb' }}>
                      We flagged filler words like "um", "ah", "like", and "basically".
                    </p>
                  </div>

                  <div className="interview-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#888', margin: '0 0 1rem 0', textTransform: 'uppercase' }}>Speaking Pace</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--saas-primary)', textTransform: 'capitalize' }}>
                        {comm.pace}
                      </span>
                    </div>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#bbb' }}>
                      Pacing calculation is determined by speaking speed and pauses.
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* Tab: History */}
            {activeTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {rounds.map((round, idx) => (
                  <div key={idx} className="interview-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--saas-primary)' }}>Round {idx + 1} Evaluation</span>
                      <span className={`match-score ${round.score >= 80 ? 'score--high' : round.score >= 60 ? 'score--mid' : 'score--low'}`} style={{ margin: 0, padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        Score: {round.score}/100
                      </span>
                    </div>
                    
                    {/* Q */}
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#888', margin: '0 0 0.25rem 0' }}>QUESTION</p>
                      <p style={{ color: '#fff', margin: 0, fontSize: '0.95rem' }}>{round.question}</p>
                    </div>

                    {/* A */}
                    <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '6px', borderLeft: '3px solid rgba(255,255,255,0.1)' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#888', margin: '0 0 0.25rem 0' }}>YOUR RESPONSE</p>
                      <p style={{ color: '#ccc', margin: 0, fontSize: '0.95rem' }}>{round.answer}</p>
                    </div>

                    {/* Feedback */}
                    <div>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#888', margin: '0 0 0.25rem 0' }}>COACH FEEDBACK</p>
                      <p style={{ color: '#aaa', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{round.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Sidebar: Scores */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Overall Score Dial */}
            <div className="match-score-widget">
              <p className="match-score-widget__label">Overall Rating</p>
              <div className={`match-score-widget__ring ${overallScoreColor}`}>
                <span className="match-score-widget__value">{session.overallScore || 0}</span>
                <span className="match-score-widget__pct">%</span>
              </div>
              <p className="match-score-widget__sub" style={{ fontSize: '0.85rem', color: '#888' }}>
                Calculated across all 5 interview rounds.
              </p>
            </div>

            {/* Detailed metrics slider views */}
            <div className="interview-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#888', margin: 0, textTransform: 'uppercase' }}>Skills &amp; Clarity</h3>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>Confidence Level</span>
                  <span>{comm.confidence}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${comm.confidence}%`, background: 'var(--saas-primary)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span>Articulation Clarity</span>
                  <span>{comm.clarity}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${comm.clarity}%`, background: 'var(--saas-primary)' }} />
                </div>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </Protected>
  );
}
