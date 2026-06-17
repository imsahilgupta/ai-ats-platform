'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../contexts/ToastContext';

export default function ContactPage() {
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const { showToast } = useToast();

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        showToast("Message sent! We'll get back to you within 24 hours.", 'success');
        setTimeout(() => {
            setSubmitted(false);
            setContactForm({ name: '', email: '', message: '' });
        }, 3000);
    };

    return (
        <div className="landing-page" style={{ gap: '4rem' }}>
            <Link href="/" className="back-btn" style={{ marginBottom: '-2rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Home</span>
            </Link>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="contact-container">
                    <div className="contact-info">
                        <span className="section-tag">Contact Us</span>
                        <h2 className="section-title">Have Questions? Reach Out!</h2>
                        <p className="contact-desc">
                            Want to learn more about our enterprise plans, API integrations, or have suggestions for new features? Send us a message and our support team will get back to you within 24 hours.
                        </p>
                        <div className="contact-details">
                            <div className="contact-detail-item">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                <span>support@ai-ats-strategy.com</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="contact-form-container">
                        {submitted ? (
                            <div className="contact-form-success">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <h3>Thank you!</h3>
                                <p>Your message has been sent successfully. We will contact you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="contact-form">
                                <div className="input-group">
                                    <label htmlFor="contact-name">Name</label>
                                    <input 
                                        type="text" 
                                        id="contact-name" 
                                        required 
                                        value={contactForm.name} 
                                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="contact-email">Email Address</label>
                                    <input 
                                        type="email" 
                                        id="contact-email" 
                                        required 
                                        value={contactForm.email} 
                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="contact-message">Message</label>
                                    <textarea 
                                        id="contact-message" 
                                        required 
                                        rows="4" 
                                        value={contactForm.message} 
                                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button type="submit" className="button primary-button contact-submit-btn">Send Message</button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
