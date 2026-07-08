"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { getMockResult, submitMockAnswer } from "@/services/saas.api";
import Protected from "@/components/Protected";

export default function MockInterviewSession() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const sessionId = params?.id;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Timer states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // Speech Recognition Ref
  const recognitionRef = useRef(null);

  // Load session initially
  useEffect(() => {
    if (!sessionId) return;
    async function fetchSession() {
      try {
        const data = await getMockResult(sessionId);
        setSession(data.session);
        if (data.session.status === "completed") {
          router.push(`/mock-interview/result/${sessionId}`);
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to load interview session details.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [sessionId]);

  // Handle active session timer
  useEffect(() => {
    if (session && session.status === "ongoing") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session]);

  // Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event) => {
          let interimTranscript = "";
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setAnswer((prev) => (prev + " " + finalTranscript).trim());
          }
        };

        rec.onerror = (e) => {
          console.warn("Speech recognition warning/error:", e.error);
          setIsListening(false);
          if (e.error === "not-allowed") {
            showToast(
              "Microphone access was denied. Please check your browser microphone permissions.",
              "error",
            );
          } else if (e.error === "no-speech") {
            showToast(
              "No speech detected. Please try speaking closer to your mic.",
              "info",
            );
          } else if (e.error === "audio-capture") {
            showToast(
              "No microphone was detected. Please plug in a microphone.",
              "warning",
            );
          } else if (e.error === "network") {
            showToast("Network error during speech recognition.", "error");
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast(
        "Speech Recognition is not supported in this browser. Please use text input or browser fallback.",
        "warning",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast(
          "Listening... Speak clearly into your microphone.",
          "success",
        );
      } catch (err) {
        console.error("Failed to start speech recognition", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      showToast("Please provide an answer before submitting.", "warning");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setSubmitting(true);
    try {
      const data = await submitMockAnswer({
        sessionId,
        answer: answer.trim(),
        durationSeconds: elapsedSeconds,
      });

      setSession(data.session);
      setAnswer("");
      setElapsedSeconds(0);

      if (data.completed) {
        showToast("Mock Interview completed! Compiling metrics...", "success");
        router.push(`/mock-interview/result/${sessionId}`);
      } else {
        showToast("Answer recorded! Next question ready.", "success");
      }
    } catch (err) {
      // Surface the server's specific error message when available
      const serverMsg = err?.response?.data?.message;
      showToast(
        serverMsg || "Failed to submit answer. Please try again.",
        "error",
      );
      console.error("Submit answer error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="spinner" />
        <p>Initializing AI Interview Simulator...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="loading-screen">
        <p>Interview session not found.</p>
      </main>
    );
  }

  // Calculate current round
  const currentRound = session.answers.length + 1;
  const totalRounds = 5;

  // Find the last interviewer message
  const lastInterviewerMessage = [...session.chatHistory]
    .reverse()
    .find((msg) => msg.role === "interviewer");
  const activeQuestion = lastInterviewerMessage
    ? lastInterviewerMessage.content
    : "Starting simulation...";

  // Format timer
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  return (
    <Protected>
      <div
        className="home-page"
        style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem 1rem" }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.8rem", margin: 0 }}>
              Session: <span className="highlight">{session.role}</span>
            </h1>
            <p
              style={{
                margin: "0.2rem 0 0 0",
                fontSize: "0.9rem",
                color: "var(--text-muted)",
              }}
            >
              Level: {session.experienceLevel} | Type: {session.interviewType}
            </p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div
              style={{
                background: "var(--info-bg)",
                border: "1px solid var(--border-color)",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "1rem",
              }}
            >
              Timer: {formatTime(elapsedSeconds)}
            </div>
            <div
              style={{
                background: "var(--accent)",
                color: "#fff",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
              }}
            >
              Round {currentRound} / {totalRounds}
            </div>
          </div>
        </header>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
        >
          {/* Interviewer Box */}
          <div
            className="interview-card"
            style={{
              padding: "2rem",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: submitting
                    ? "var(--severity-medium)"
                    : "var(--severity-low)",
                  display: "inline-block",
                  animation: submitting ? "pulse 1.5s infinite" : "none",
                }}
              />
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  color: "var(--text-muted)",
                  uppercase: true,
                }}
              >
                {submitting ? "Interviewer is reviewing..." : "AI Interviewer"}
              </span>
            </div>
            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.7",
                color: "var(--text-primary)",
                marginTop: "1.5rem",
                marginBottom: 0,
              }}
            >
              {submitting
                ? "Analyzing your answer and preparing the next question. Please wait..."
                : activeQuestion}
            </p>
          </div>

          {/* User Response Box */}
          <form
            onSubmit={handleSubmit}
            className="interview-card"
            style={{ overflow: "hidden" }}
          >
            <div
              className="interview-card__body"
              style={{
                flexDirection: "column",
                gap: "1.5rem",
                padding: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <label
                  style={{
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                  }}
                >
                  Your Response
                </label>

                {/* Speech recognition toggle */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`button ${isListening ? "primary-button" : "secondary-button"}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 1rem",
                    fontSize: "0.85rem",
                    borderColor: isListening
                      ? "var(--severity-high)"
                      : "var(--border-color)",
                    background: isListening
                      ? "rgba(239, 68, 68, 0.1)"
                      : "var(--info-bg)",
                    color: isListening
                      ? "var(--severity-high)"
                      : "var(--text-primary)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{
                      animation: isListening ? "pulse 1s infinite" : "none",
                    }}
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                  {isListening ? "Stop Voice Input" : "Use Voice Input"}
                </button>
              </div>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your response here or enable Voice Input to transcribe your voice in real time..."
                disabled={submitting}
                style={{
                  width: "100%",
                  minHeight: "180px",
                  padding: "1rem",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  color: "var(--text-primary)",
                  fontSize: "1.05rem",
                  lineHeight: "1.6",
                  outline: "none",
                  resize: "vertical",
                  transition: "border 0.2s",
                }}
              />
            </div>

            <div
              className="interview-card__footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span className="footer-info">
                Make sure to address the core problem using STAR framework.
              </span>
              <button
                type="submit"
                disabled={submitting || !answer.trim()}
                className="generate-btn"
                style={{
                  cursor:
                    submitting || !answer.trim() ? "not-allowed" : "pointer",
                  opacity: submitting || !answer.trim() ? 0.6 : 1,
                }}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner"
                      style={{
                        width: "14px",
                        height: "14px",
                        marginRight: "0.5rem",
                        borderWidth: "2px",
                      }}
                    />
                    Submitting Answer...
                  </>
                ) : (
                  <>
                    Submit Answer
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  );
}
