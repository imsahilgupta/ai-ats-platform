"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInterview } from "../hooks/useInterview";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../contexts/ToastContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAnalytics } from "../services/saas.api";

// ── Upgraded Landing Page Sub-Component ──
const LandingPage = ({ showToast }) => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [faqOpen, setFaqOpen] = useState({});

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setNewsletterSubmitted(true);
    showToast("You're subscribed! Watch your inbox for updates.", "success");
    setTimeout(() => {
      setNewsletterSubmitted(false);
      setNewsletterEmail("");
    }, 3000);
  };

  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSimulatedUpgrade = async (plan) => {
    showToast(`Upgrading to ${plan}... Redirecting to auth.`, "info");
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">All-In-One Career Copilot Platform</span>
          <h1 className="hero-title">
            Supercharge Your Career Prep with{" "}
            <span className="highlight">MockMate.AI</span>
          </h1>
          <p className="hero-desc">
            MockMate is a streamlined SaaS platform built to help you land your
            dream job. Optimize resumes and simulate speech-driven mock
            interviews with focused AI feedback.
          </p>
          <div className="hero-actions">
            <Link
              href="/register"
              className="button primary-button hero-cta-btn"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="button secondary-button hero-sec-btn"
            >
              Explore Features
            </a>
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
              <div className="preview-sidebar" style={{ width: "40%" }}>
                <div className="preview-score-widget">
                  <div className="preview-score-ring">94%</div>
                  <div className="preview-score-label">Resume Match</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    marginTop: "1rem",
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "#ff4d4f" }}>
                    ✗ Missing "Zustand"
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#3fb950" }}>
                    ✓ Found "Next.js"
                  </span>
                </div>
              </div>
              <div className="preview-content">
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "6px",
                    padding: "0.5rem",
                    background: "rgba(0,0,0,0.1)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    Mock Interview Session
                  </p>
                  <p
                    style={{
                      margin: "0.2rem 0 0 0",
                      fontSize: "0.75rem",
                      color: "#aaa",
                    }}
                  >
                    Speech filler-words count: 1
                  </p>
                  <p
                    style={{
                      margin: "0.2rem 0 0 0",
                      fontSize: "0.75rem",
                      color: "#3fb950",
                    }}
                  >
                    Overall Score: 88/100
                  </p>
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
        <p className="section-desc">
          Get access to professional modules optimized to maximize interview
          conversions.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--saas-primary)"
                strokeWidth="2"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <h3 className="feature-card__title">Interactive Voice Simulator</h3>
            <p className="feature-card__desc">
              Simulate realistic hiring rounds. Practice using voice
              transcription, pacing analyzers, and filler-word flags in real
              time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--saas-primary)"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="feature-card__title">ATS Resume Audits</h3>
            <p className="feature-card__desc">
              Scan keywords, evaluate formatting, and view interactive
              side-by-side Before/After metric bullet points optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section Grid */}
      <section
        id="pricing"
        style={{
          padding: "5rem 2rem",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}
        >
          <span className="section-tag">Flexible Subscriptions</span>
          <h2 className="section-title">Upgrade Your Prep Pipeline</h2>
          <p className="section-desc">
            Unlock premium mock interview counts and continuous AI suggestions.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              marginTop: "3rem",
            }}
          >
            {/* Free tier */}
            <div
              className="interview-card"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  color: "var(--text-primary)",
                }}
              >
                Free Tier
              </h3>
              <div style={{ margin: "1rem 0" }}>
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                  }}
                >
                  $0
                </span>
                <span style={{ color: "var(--text-muted)" }}> / month</span>
              </div>
              <ul
                style={{
                  textAlign: "left",
                  paddingLeft: "1rem",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  lineHeight: "1.8",
                  flexGrow: 1,
                }}
              >
                <li>3 Mock Interviews / Month</li>
                <li>Basic Resume Match Score</li>
                <li>Core interview practice workspace</li>
              </ul>
              <Link
                href="/register"
                className="button secondary-button"
                style={{ marginTop: "1.5rem", display: "block" }}
              >
                Get Started
              </Link>
            </div>

            {/* Pro tier */}
            <div
              className="interview-card"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                border: "2px solid var(--accent)",
                background: "var(--bg-card)",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  padding: "2px 10px",
                  borderRadius: "10px",
                }}
              >
                POPULAR
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  color: "var(--text-primary)",
                }}
              >
                PRO Plan
              </h3>
              <div style={{ margin: "1rem 0" }}>
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                  }}
                >
                  $19
                </span>
                <span style={{ color: "var(--text-muted)" }}> / month</span>
              </div>
              <ul
                style={{
                  textAlign: "left",
                  paddingLeft: "1rem",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  lineHeight: "1.8",
                  flexGrow: 1,
                }}
              >
                <li>Unlimited Speech Simulation</li>
                <li>Advanced ATS Keyword Reports</li>
                <li>Detailed Before/After Optimizations</li>
                <li>Priority Career Chatbot &amp; Coaching</li>
              </ul>
              <button
                onClick={() => handleSimulatedUpgrade("PRO")}
                className="button primary-button"
                style={{ marginTop: "1.5rem", display: "block", width: "100%" }}
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise tier */}
            <div
              className="interview-card"
              style={{
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  color: "var(--text-primary)",
                }}
              >
                Enterprise Plan
              </h3>
              <div style={{ margin: "1rem 0" }}>
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                  }}
                >
                  $49
                </span>
                <span style={{ color: "var(--text-muted)" }}> / month</span>
              </div>
              <ul
                style={{
                  textAlign: "left",
                  paddingLeft: "1rem",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  lineHeight: "1.8",
                  flexGrow: 1,
                }}
              >
                <li>Everything in Pro</li>
                <li>Multi-profile team logins</li>
                <li>Custom corporate training cases</li>
                <li>Dedicated account support</li>
              </ul>
              <button
                onClick={() => handleSimulatedUpgrade("ENTERPRISE")}
                className="button secondary-button"
                style={{ marginTop: "1.5rem", display: "block", width: "100%" }}
              >
                Upgrade Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section
        style={{
          padding: "5rem 2rem",
          background: "var(--bg-page)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span
            className="section-tag"
            style={{ display: "block", textAlign: "center" }}
          >
            Got Questions?
          </span>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            Frequently Asked Questions
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "3rem",
            }}
          >
            {[
              {
                q: "How does the Speech Simulator track filler words?",
                a: "We run standard Web Speech API transcription on the browser, and then process the raw audio outputs to compute pacing, pauses, and flag typical fillers like 'um', 'ah', 'like', and 'basically'.",
              },
              {
                q: "Can I use MockMate without uploading a resume?",
                a: "Yes! You can manually paste a Quick Self-Description or outline target competencies directly to get dynamic questions generated for you.",
              },
              {
                q: "How accurate is the ATS match score?",
                a: "We leverage Gemini 2.5 models comparing your resume keywords directly with the semantic contexts of target job descriptions to calculate true compatibility percentage score.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  padding: "1rem",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span>{faq.q}</span>
                  <span>{faqOpen[idx] ? "−" : "+"}</span>
                </button>
                {faqOpen[idx] && (
                  <p
                    style={{
                      margin: "0.75rem 0 0 0",
                      color: "#bbb",
                      fontSize: "0.9rem",
                      lineHeight: "1.5",
                    }}
                  >
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
              Subscribe to our newsletter to receive the latest interview
              strategies, resume tailoring tips, and industry trends directly in
              your inbox.
            </p>
          </div>
          <div className="newsletter-form-container">
            {newsletterSubmitted ? (
              <div className="newsletter-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3fb950"
                  strokeWidth="2.5"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h4>Thanks for subscribing!</h4>
                <p>You'll receive our next issue soon.</p>
              </div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="newsletter-form"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="newsletter-input"
                />
                <button
                  type="submit"
                  className="button primary-button newsletter-btn"
                >
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
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard', 'create-plan'

  // Auto-fill JD and Self Description from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedJD = localStorage.getItem("ats_saved_jd");
      const savedSD = localStorage.getItem("ats_saved_sd");
      if (savedJD) setJobDescription(savedJD);
      if (savedSD) setSelfDescription(savedSD);
    }
  }, []);

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
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    if (data && data._id) {
      router.push(`/interview/${data._id}`);
    }
  };

  if (authLoading) {
    return (
      <main className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </main>
    );
  }

  if (interviewLoading) {
    return (
      <main className="loading-screen">
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
    <div
      className="home-page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        paddingBottom: "3rem",
        justifyContent: "flex-start",
        paddingInline: "1.5rem",
        gap: "0",
      }}
    >
      {/* ── Welcome Banner ── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #818CF8 100%)",
          padding: "2.25rem 2.5rem",
          borderRadius: "1.25rem",
          color: "#fff",
          marginBottom: "1.75rem",
          boxShadow: "0 8px 32px rgba(79, 70, 229, 0.18)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          width: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div style={{ flex: "1 1 400px", position: "relative", zIndex: 1 }}>
          <span
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              padding: "0.3rem 0.9rem",
              borderRadius: "2rem",
              fontSize: "0.72rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              display: "inline-block",
              marginBottom: "0.85rem",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {stats && stats.level >= 5
              ? "🏆 Expert Candidate"
              : "🚀 Career Prep Mode"}
          </span>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "800",
              margin: 0,
              color: "#fff",
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-sora)",
              lineHeight: 1.2,
            }}
          >
            Welcome back, {user.username}!
          </h1>
          <p
            style={{
              margin: "0.6rem 0 0 0",
              opacity: 0.85,
              fontSize: "0.95rem",
              maxWidth: "560px",
              lineHeight: "1.6",
            }}
          >
            Your AI-powered career platform. Optimize your resume, simulate
            interviews, track applications, and get coached — all in one place.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            { label: "XP Points", value: stats?.xp ?? "—" },
            { label: "Level", value: stats ? `Lvl ${stats.level}` : "—" },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                padding: "1rem 1.5rem",
                borderRadius: "0.9rem",
                border: "1px solid rgba(255,255,255,0.18)",
                textAlign: "center",
                minWidth: "110px",
              }}
            >
              <div
                style={{
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  opacity: 0.8,
                  fontWeight: "700",
                  letterSpacing: "0.07em",
                  marginBottom: "0.2rem",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "900",
                  fontFamily: "var(--font-sora)",
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat Summary Row ── */}
      {!statsLoading && stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.85rem",
            marginBottom: "2rem",
            width: "100%",
          }}
        >
          {[
            {
              icon: "🏅",
              label: "Badges",
              value: stats.badges?.length ?? 0,
              color: "#10B981",
            },
            {
              icon: "🎙️",
              label: "Interviews Done",
              value: stats.sessionsHistory?.length ?? 0,
              color: "#818CF8",
            },
            {
              icon: "📊",
              label: "ATS Score",
              value: stats.latestResumeScore
                ? `${stats.latestResumeScore}%`
                : "N/A",
              color:
                stats.latestResumeScore >= 80
                  ? "#10B981"
                  : stats.latestResumeScore >= 60
                    ? "#F59E0B"
                    : "#EF4444",
            },
          ].map(({ icon, label, value, color }) => (
            <div
              key={label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "0.9rem",
                padding: "1.1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.85rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: `${color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: "800",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sora)",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    fontWeight: "500",
                    marginTop: "0.15rem",
                  }}
                >
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Quick Access Tools ── */}
      <div style={{ marginBottom: "2rem", width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              margin: 0,
              fontWeight: "700",
            }}
          >
            Quick Access
          </h2>
          <span
            style={{ fontSize: "0.75rem", color: "var(--text-muted-light)" }}
          >
            2 core tools
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
            gap: "0.85rem",
          }}
        >
          {[
            {
              href: "/mock-interview",
              icon: "🎙️",
              label: "Mock Simulator",
              desc: "Practice interviews in real-time",
              color: "var(--accent)",
              bg: "rgba(79,70,229,0.07)",
            },
            {
              href: "/resume-analyzer",
              icon: "📄",
              label: "Resume Scan",
              desc: "Check ATS score & optimize phrases",
              color: "#10B981",
              bg: "rgba(16,185,129,0.07)",
            },
          ].map(({ href, icon, label, desc, color, bg }) => (
            <Link
              key={href}
              href={href}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "0.9rem",
                padding: "1.1rem 1.15rem",
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
                textDecoration: "none",
                transition: "all 0.18s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(79,70,229,0.09)";
                e.currentTarget.style.borderColor = "var(--accent-alt)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "9px",
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <strong
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-primary)",
                    display: "block",
                    fontWeight: "700",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {label}
                </strong>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    lineHeight: "1.4",
                    display: "block",
                  }}
                >
                  {desc}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div
        style={{
          display: "flex",
          borderBottom: "2px solid var(--border-color)",
          marginBottom: "2rem",
          width: "100%",
        }}
      >
        {[
          { key: "dashboard", label: "📊 Stats & Progress" },
          { key: "create-plan", label: "✨ Create Strategy Plan" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: "0.8rem 1.4rem",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === key
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              marginBottom: "-2px",
              color: activeTab === key ? "var(--accent)" : "var(--text-muted)",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.88rem",
              transition: "all 0.2s",
              borderRadius: "0",
              fontFamily: "var(--font-stack)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" ? (
        /* ── Stats & Gamification ── */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "1.5rem",
            width: "100%",
            alignItems: "start",
          }}
        >
          {/* Left Column */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {!statsLoading && stats ? (
              <>
                {/* Level Progression Card */}
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "1rem",
                    padding: "1.75rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: "1rem",
                          margin: 0,
                          fontWeight: "700",
                          color: "var(--text-primary)",
                        }}
                      >
                        Learning Progression
                      </h2>
                      <p
                        style={{
                          margin: "0.2rem 0 0 0",
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        XP journey to your next level
                      </p>
                    </div>
                    <span
                      style={{
                        background: "rgba(79,70,229,0.08)",
                        color: "var(--accent)",
                        fontWeight: "700",
                        fontSize: "0.82rem",
                        padding: "0.3rem 0.85rem",
                        borderRadius: "2rem",
                        border: "1px solid rgba(79,70,229,0.15)",
                        flexShrink: 0,
                      }}
                    >
                      Level {stats.level}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.78rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {stats.xp} XP earned
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      Next: {Math.ceil((stats.xp + 1) / 1000) * 1000} XP
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "var(--info-bg)",
                      borderRadius: "999px",
                      overflow: "hidden",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min((stats.xp % 1000) / 10, 100)}%`,
                        background:
                          "linear-gradient(90deg, var(--accent), var(--accent-alt))",
                        borderRadius: "999px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                  <div style={{ marginTop: "1.5rem" }}>
                    <h3
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        marginBottom: "0.75rem",
                        fontWeight: "700",
                      }}
                    >
                      Earned Badges
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.6rem",
                        flexWrap: "wrap",
                      }}
                    >
                      {stats.badges && stats.badges.length > 0 ? (
                        stats.badges.map((badge, i) => (
                          <div
                            key={i}
                            title={badge.description}
                            style={{
                              background: "var(--info-bg)",
                              border: "1px solid var(--border-color)",
                              borderRadius: "0.65rem",
                              padding: "0.45rem 0.8rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                            }}
                          >
                            <span style={{ fontSize: "1.1rem" }}>
                              {badge.icon || "🏅"}
                            </span>
                            <div>
                              <strong
                                style={{
                                  fontSize: "0.75rem",
                                  color: "var(--text-primary)",
                                  display: "block",
                                  fontWeight: "700",
                                }}
                              >
                                {badge.name}
                              </strong>
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  color: "var(--text-muted)",
                                }}
                              >
                                Earned{" "}
                                {new Date(
                                  badge.dateEarned,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.82rem",
                            margin: 0,
                            fontStyle: "italic",
                          }}
                        >
                          Complete mock rounds to unlock badges!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "1rem",
                  padding: "3rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div className="spinner" />
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  Loading your stats...
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* ATS Score Widget */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "1rem",
                padding: "1.75rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--text-muted)",
                  fontWeight: "700",
                  margin: "0 0 1.5rem 0",
                }}
              >
                Latest ATS Score
              </h3>
              {stats ? (
                <>
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      margin: "0 auto 1rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `5px solid ${(stats.latestResumeScore || 0) >= 80 ? "#10B981" : (stats.latestResumeScore || 0) >= 60 ? "#F59E0B" : "#EF4444"}`,
                      boxShadow: `0 0 0 5px ${(stats.latestResumeScore || 0) >= 80 ? "rgba(16,185,129,0.1)" : (stats.latestResumeScore || 0) >= 60 ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)"}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: "900",
                        fontFamily: "var(--font-sora)",
                        color:
                          (stats.latestResumeScore || 0) >= 80
                            ? "#10B981"
                            : (stats.latestResumeScore || 0) >= 60
                              ? "#F59E0B"
                              : "#EF4444",
                        lineHeight: 1,
                      }}
                    >
                      {stats.latestResumeScore || 0}
                    </span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        fontWeight: "600",
                      }}
                    >
                      / 100
                    </span>
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "2rem",
                      fontSize: "0.72rem",
                      fontWeight: "700",
                      background:
                        (stats.latestResumeScore || 0) >= 80
                          ? "rgba(16,185,129,0.1)"
                          : (stats.latestResumeScore || 0) >= 60
                            ? "rgba(245,158,11,0.1)"
                            : "rgba(239,68,68,0.1)",
                      color:
                        (stats.latestResumeScore || 0) >= 80
                          ? "#10B981"
                          : (stats.latestResumeScore || 0) >= 60
                            ? "#F59E0B"
                            : "#EF4444",
                    }}
                  >
                    {(stats.latestResumeScore || 0) >= 80
                      ? "✓ Strong Match"
                      : (stats.latestResumeScore || 0) >= 60
                        ? "⚡ Good Match"
                        : "⚠ Needs Improvement"}
                  </span>
                  <p
                    style={{
                      margin: "0.9rem 0 0",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      lineHeight: "1.5",
                    }}
                  >
                    Upload your resume to get your latest ATS match score.
                  </p>
                </>
              ) : (
                <div className="spinner" style={{ margin: "0 auto" }} />
              )}
            </div>

            {/* Interview Performance */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "1rem",
                padding: "1.75rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <h3
                style={{
                  fontSize: "0.72rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "var(--text-muted)",
                  fontWeight: "700",
                  margin: "0 0 1.25rem 0",
                }}
              >
                Simulator Performance
              </h3>
              {stats &&
                [
                  {
                    label: "Technical",
                    value: stats.interviewPerformance?.technical || 0,
                    color: "var(--accent)",
                  },
                  {
                    label: "Behavioral",
                    value: stats.interviewPerformance?.behavioral || 0,
                    color: "#10B981",
                  },
                  {
                    label: "HR / Culture",
                    value: stats.interviewPerformance?.hr || 0,
                    color: "#F59E0B",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.78rem",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          color: "var(--text-primary)",
                        }}
                      >
                        {label}
                      </span>
                      <span style={{ fontWeight: "700", color }}>{value}%</span>
                    </div>
                    <div
                      style={{
                        height: "5px",
                        background: "var(--info-bg)",
                        borderRadius: "999px",
                        overflow: "hidden",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${value}%`,
                          background: color,
                          borderRadius: "999px",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              {!stats && (
                <div className="spinner" style={{ margin: "0 auto" }} />
              )}
            </div>

            {/* Quick CTA */}
            <Link
              href="/resume-analyzer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(79,70,229,0.05), rgba(129,140,248,0.08))",
                border: "1px solid rgba(79,70,229,0.18)",
                borderRadius: "1rem",
                padding: "1.15rem 1.4rem",
                display: "flex",
                alignItems: "center",
                gap: "0.9rem",
                textDecoration: "none",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "rgba(79,70,229,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(79,70,229,0.18)";
                e.currentTarget.style.background =
                  "linear-gradient(135deg, rgba(79,70,229,0.05), rgba(129,140,248,0.08))";
              }}
            >
              <span style={{ fontSize: "1.6rem" }}>📄</span>
              <div>
                <strong
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--accent)",
                    display: "block",
                    fontWeight: "700",
                  }}
                >
                  Scan Your Resume
                </strong>
                <span
                  style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}
                >
                  Get instant ATS keyword score →
                </span>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        /* ── Create Strategy Plan ── */
        <div>
          <header className="page-header">
            <h1>
              Create Your Custom{" "}
              <span className="highlight">Interview Plan</span>
            </h1>
            <p>
              Let our AI analyze the job requirements and your unique profile to
              build a winning strategy.
            </p>
          </header>

          <div className="interview-card">
            <div className="interview-card__body">
              <div className="panel panel--left">
                <div className="panel__header">
                  <span className="panel__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </span>
                  <h2>Target Job Description</h2>
                  <span className="badge badge--required">Required</span>
                </div>
                <textarea
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                  }}
                  className="panel__textarea"
                  placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                  maxLength={5000}
                  value={jobDescription}
                />
                <div className="char-counter">
                  {jobDescription.length} / 5000 chars
                </div>
              </div>

              <div className="panel-divider" />

              <div className="panel panel--right">
                <div className="panel__header">
                  <span className="panel__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <h2>Your Profile</h2>
                </div>
                <div className="upload-section">
                  <label className="section-label">
                    Upload Resume
                    <span className="badge badge--best">Best Results</span>
                  </label>
                  <label className="dropzone" htmlFor="resume">
                    <span className="dropzone__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      </svg>
                    </span>
                    <p className="dropzone__title">
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                    <input
                      ref={resumeInputRef}
                      hidden
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.docx"
                    />
                  </label>
                </div>
                <div className="or-divider">
                  <span>OR</span>
                </div>
                <div className="self-description">
                  <label className="section-label" htmlFor="selfDescription">
                    Quick Self-Description
                  </label>
                  <textarea
                    onChange={(e) => {
                      setSelfDescription(e.target.value);
                    }}
                    id="selfDescription"
                    name="selfDescription"
                    className="panel__textarea panel__textarea--short"
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                    value={selfDescription}
                  />
                </div>
                <div className="info-box">
                  <span className="info-box__icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line
                        x1="12"
                        y1="8"
                        x2="12"
                        y2="12"
                        stroke="#1a1f27"
                        strokeWidth="2"
                      />
                      <line
                        x1="12"
                        y1="16"
                        x2="12.01"
                        y2="16"
                        stroke="#1a1f27"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  <p>
                    Either a <strong>Resume</strong> or a{" "}
                    <strong>Self Description</strong> is required to generate a
                    personalized plan.
                  </p>
                </div>
              </div>
            </div>
            <div className="interview-card__footer">
              <span className="footer-info">
                AI-Powered Strategy Generation &bull; Approx 30s
              </span>
              <button onClick={handleGenerateReport} className="generate-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                Generate My Interview Strategy
              </button>
            </div>
          </div>

          {reports && reports.length > 0 && (
            <section className="recent-reports" style={{ marginTop: "3rem" }}>
              <h2>My Recent Interview Plans</h2>
              <ul className="reports-list">
                {reports.map((report) => (
                  <li
                    key={report._id}
                    className="report-item"
                    onClick={() => router.push(`/interview/${report._id}`)}
                  >
                    <h3>{report.title || "Untitled Position"}</h3>
                    <p className="report-meta">
                      Generated on{" "}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                    <p
                      className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                    >
                      Match Score: {report.matchScore}%
                    </p>
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
