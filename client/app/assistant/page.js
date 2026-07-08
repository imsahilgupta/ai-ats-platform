'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { chatAssistant } from '@/services/saas.api';
import Protected from '@/components/Protected';

export default function AssistantCoach() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! I'm your AI Career Coach. I have analyzed your profile context (if uploaded) and can help you optimize your study roadmap, address skill gaps, or prep for interviews. What would you like to discuss today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e, customText = '') => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    if (!customText) setInput('');

    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Format chat history for backend (excluding the first intro greeting)
      const chatHistory = updatedMessages.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // Call assistant API
      const data = await chatAssistant(textToSend, chatHistory);
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error(err);
      showToast("Failed to reach Career Coach. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const PRESET_PROMPTS = [
    "How can I resolve my missing resume keywords?",
    "Recommend a learning plan for system design",
    "What behavioral templates should I use?",
    "Give me tips to negotiate my tech offer"
  ];

  return (
    <Protected>
      <div className="home-page" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem', height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <header style={{ marginBottom: '1.5rem', flexShrink: 0 }}>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>AI Career <span className="highlight">Assistant</span></h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>
            Personalized strategy coach loaded with your profile intelligence context.
          </p>
        </header>

        {/* Chat Area Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', flexGrow: 1, minHeight: 0 }}>
          
          {/* Active Pane */}
          <div className="interview-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
            
            {/* Messages Scroller */}
            <div style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      width: '100%'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '0.85rem 1.1rem',
                        borderRadius: '12px',
                        borderTopRightRadius: isUser ? '2px' : '12px',
                        borderTopLeftRadius: isUser ? '12px' : '2px',
                        background: isUser ? 'var(--accent)' : 'var(--info-bg)',
                        border: isUser ? 'none' : '1px solid var(--border-color)',
                        color: isUser ? '#fff' : 'var(--text-primary)',
                        fontWeight: isUser ? '500' : 'normal',
                        lineHeight: '1.5',
                        fontSize: '0.95rem',
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                  <div style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: '12px',
                    borderTopLeftRadius: '2px',
                    background: 'var(--info-bg)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }} />
                    Coach is drafting response...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Bar */}
            <form onSubmit={(e) => handleSend(e)} style={{
              padding: '1rem',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-page)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <input
                type="text"
                placeholder="Ask your coach anything about resumes, coding challenges, behaviorals..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                style={{
                  flexGrow: 1,
                  padding: '0.8rem 1rem',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="generate-btn"
                style={{
                  width: 'auto',
                  padding: '0.8rem 1.5rem',
                  fontSize: '0.9rem',
                  borderRadius: '8px',
                  cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !input.trim()) ? 0.6 : 1
                }}
              >
                Send
              </button>
            </form>

          </div>

          {/* Right Sidebar - Preset Prompts & Tips */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexShrink: 0 }}>
            
            {/* Quick Prompts */}
            <div className="interview-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 1rem 0' }}>Suggested Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PRESET_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    disabled={loading}
                    onClick={() => handleSend(null, prompt)}
                    style={{
                      background: 'var(--info-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '0.6rem',
                      textAlign: 'left',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      lineHeight: '1.4'
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.color = 'var(--accent)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Context Widget */}
            <div className="interview-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Context Enriched</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                The coach automatically extracts database context from your latest resume ATS audit to deliver context-aware answers without manual copying.
              </p>
            </div>

          </aside>

        </div>

      </div>
    </Protected>
  );
}
