'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useInterview } from '../../hooks/useInterview';

const TABS = [
    {
        id: 'account', label: 'Account',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    },
    {
        id: 'responses', label: 'Responses',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    },
    {
        id: 'saved', label: 'Saved Inputs',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
    },
    {
        id: 'danger', label: 'Danger Zone',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    },
];

function getInitials(username) {
    if (!username) return '?';
    return username.slice(0, 2).toUpperCase();
}

function ScoreBadge({ score }) {
    const cls = score >= 80 ? 'score--high' : score >= 60 ? 'score--mid' : 'score--low';
    return <span className={`response-score ${cls}`}>{score}% match</span>;
}

// ── Account Tab ──────────────────────────────────────────────────────────────
function AccountTab({ user, handleUpdateUsername }) {
    const [username, setUsername] = useState(user?.username || '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user?.username) setUsername(user.username);
    }, [user]);

    const onSave = async (e) => {
        e.preventDefault();
        if (!username.trim() || username === user?.username) return;
        setSaving(true);
        await handleUpdateUsername(username.trim());
        setSaving(false);
    };

    return (
        <div className="profile-section">
            <h2 className="profile-section-title">Account Details</h2>

            <div className="profile-field">
                <label>Email</label>
                <input type="email" value={user?.email || ''} disabled />
            </div>

            <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="profile-field">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Enter new username"
                        minLength={3}
                        maxLength={20}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="button primary-button profile-save-btn"
                    disabled={saving || !username.trim() || username === user?.username}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

// ── Responses Tab ─────────────────────────────────────────────────────────────
function ResponsesTab({ reports, deleteReport }) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(null);

    const onDelete = async (e, id) => {
        e.stopPropagation();
        setDeleting(id);
        await deleteReport(id);
        setDeleting(null);
    };

    if (!reports || reports.length === 0) {
        return (
            <div className="profile-section">
                <h2 className="profile-section-title">Generated Responses</h2>
                <p className="response-empty">No interview plans generated yet. <Link href="/">Create your first one →</Link></p>
            </div>
        );
    }

    return (
        <div className="profile-section">
            <h2 className="profile-section-title">Generated Responses <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>({reports.length})</span></h2>
            <div className="response-list">
                {reports.map(report => (
                    <div key={report._id} className="response-item">
                        <div className="response-item__info" onClick={() => router.push(`/interview/${report._id}`)}>
                            <span className="response-item__title">{report.title || 'Untitled Position'}</span>
                            <span className="response-item__meta">
                                <span>{new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                <ScoreBadge score={report.matchScore} />
                            </span>
                        </div>
                        {/* View button */}
                        <button
                            className="response-delete-btn"
                            title="View report"
                            style={{ color: 'var(--text-muted)' }}
                            onClick={() => router.push(`/interview/${report._id}`)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        {/* Delete button */}
                        <button
                            className="response-delete-btn"
                            title="Delete report"
                            onClick={e => onDelete(e, report._id)}
                            disabled={deleting === report._id}
                        >
                            {deleting === report._id
                                ? <div className="spinner spinner--sm" />
                                : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Saved Inputs Tab ──────────────────────────────────────────────────────────
function SavedInputsTab() {
    const [savedJD, setSavedJD] = useState('');
    const [savedSD, setSavedSD] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSavedJD(localStorage.getItem('ats_saved_jd') || '');
        setSavedSD(localStorage.getItem('ats_saved_sd') || '');
    }, []);

    const onSave = () => {
        localStorage.setItem('ats_saved_jd', savedJD);
        localStorage.setItem('ats_saved_sd', savedSD);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const onClear = () => {
        localStorage.removeItem('ats_saved_jd');
        localStorage.removeItem('ats_saved_sd');
        setSavedJD('');
        setSavedSD('');
    };

    return (
        <div className="profile-section">
            <h2 className="profile-section-title">Saved Inputs</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '-0.5rem' }}>
                These values will auto-fill the dashboard form on your next visit.
            </p>

            <div className="profile-field">
                <label>Default Job Description</label>
                <textarea
                    rows={5}
                    value={savedJD}
                    onChange={e => setSavedJD(e.target.value)}
                    placeholder="Paste a job description to pre-fill the dashboard..."
                    maxLength={5000}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>{savedJD.length}/5000</span>
            </div>

            <div className="profile-field">
                <label>Default Self Description</label>
                <textarea
                    rows={4}
                    value={savedSD}
                    onChange={e => setSavedSD(e.target.value)}
                    placeholder="Briefly describe your experience and key skills..."
                />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                    className="button primary-button profile-save-btn"
                    onClick={onSave}
                >
                    {saved ? '✓ Saved!' : 'Save Inputs'}
                </button>
                <button
                    className="button secondary-button profile-save-btn"
                    onClick={onClear}
                >
                    Clear All
                </button>
            </div>
        </div>
    );
}

// ── Danger Zone Tab ───────────────────────────────────────────────────────────
function DangerZoneTab({ handleDeleteAccount }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const onConfirmDelete = async () => {
        setDeleting(true);
        const success = await handleDeleteAccount();
        if (success) {
            router.push('/');
        } else {
            setDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <>
            <div className="danger-zone">
                <div className="danger-zone__content">
                    <h3>Delete Account</h3>
                    <p>
                        Permanently delete your account and all associated data — including all generated interview reports.
                        This action <strong>cannot be undone</strong>.
                    </p>
                </div>
                <button className="danger-btn" onClick={() => setShowConfirm(true)}>
                    Delete Account
                </button>
            </div>

            {showConfirm && (
                <div className="confirm-overlay" onClick={() => !deleting && setShowConfirm(false)}>
                    <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
                        <h3>Are you absolutely sure?</h3>
                        <p>
                            This will permanently delete your account and <strong>all {null} interview reports</strong>.
                            You cannot undo this action.
                        </p>
                        <div className="confirm-dialog__actions">
                            <button
                                className="confirm-cancel-btn"
                                onClick={() => setShowConfirm(false)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="danger-btn"
                                onClick={onConfirmDelete}
                                disabled={deleting}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {deleting
                                    ? <><div className="spinner spinner--sm" /> Deleting...</>
                                    : 'Yes, delete my account'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { user, loading: authLoading, handleUpdateUsername, handleDeleteAccount } = useAuth();
    const { reports, loading: reportsLoading, deleteReport } = useInterview();
    const [activeTab, setActiveTab] = useState('account');
    const router = useRouter();

    // Redirect unauthenticated users
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <main className="loading-screen">
                <div className="spinner" />
                <p>Loading profile...</p>
            </main>
        );
    }

    if (!user) return null;

    return (
        <main className="profile-page">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-avatar-lg">{getInitials(user.username)}</div>
                <div className="profile-header-info">
                    <h1>{user.username}</h1>
                    <p>{user.email}</p>
                </div>
            </div>

            {/* Tabs */}
            <nav className="profile-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`profile-tab-btn${activeTab === tab.id ? ' profile-tab-btn--active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Tab content */}
            {activeTab === 'account' && (
                <AccountTab user={user} handleUpdateUsername={handleUpdateUsername} />
            )}
            {activeTab === 'responses' && (
                reportsLoading
                    ? <div className="profile-section" style={{ alignItems: 'center' }}>
                        <div className="spinner" />
                        <p style={{ color: 'var(--text-muted)' }}>Loading reports...</p>
                      </div>
                    : <ResponsesTab reports={reports} deleteReport={deleteReport} />
            )}
            {activeTab === 'saved' && <SavedInputsTab />}
            {activeTab === 'danger' && (
                <DangerZoneTab handleDeleteAccount={handleDeleteAccount} />
            )}
        </main>
    );
}
