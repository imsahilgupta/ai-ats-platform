'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/contexts/ToastContext';
import { getJobApplications, createJobApplication, updateJobApplication, deleteJobApplication } from '@/services/saas.api';
import Protected from '@/components/Protected';

const COLUMNS = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function JobApplicationsTracker() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Form states
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState('Saved');
  const [interviewDate, setInterviewDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch job applications
  const loadJobs = async () => {
    try {
      const data = await getJobApplications();
      setJobs(data.applications || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load job applications.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Open modal for creating a new job application
  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setCompany('');
    setRole('');
    setJobDescription('');
    setStatus('Saved');
    setInterviewDate('');
    setNotes('');
    setIsModalOpen(true);
  };

  // Open modal for editing an existing job application
  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setCompany(job.company);
    setRole(job.role);
    setJobDescription(job.jobDescription || '');
    setStatus(job.status);
    setInterviewDate(job.interviewDate ? new Date(job.interviewDate).toISOString().split('T')[0] : '');
    setNotes(job.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      showToast("Company and Role are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        company,
        role,
        jobDescription,
        status,
        interviewDate: interviewDate || undefined,
        notes
      };

      if (editingJob) {
        await updateJobApplication(editingJob._id, payload);
        showToast("Job application updated successfully.", "success");
      } else {
        await createJobApplication(payload);
        showToast("Job application added successfully.", "success");
      }
      setIsModalOpen(false);
      loadJobs();
    } catch (err) {
      console.error(err);
      showToast("Failed to save job application.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job application?")) return;
    try {
      await deleteJobApplication(id);
      showToast("Job application deleted.", "success");
      loadJobs();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete application.", "error");
    }
  };

  // NATIVE HTML5 DRAG & DROP HANDLERS
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;

    // Optimistically update status in state first
    const updatedJobs = jobs.map(j => j._id === id ? { ...j, status: targetStatus } : j);
    setJobs(updatedJobs);

    try {
      await updateJobApplication(id, { status: targetStatus });
      showToast(`Updated status to ${targetStatus}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status on server.", "error");
      loadJobs(); // Revert state on error
    }
  };

  // Quick state update via buttons for click support
  const handleQuickStatusChange = async (id, targetStatus) => {
    const updatedJobs = jobs.map(j => j._id === id ? { ...j, status: targetStatus } : j);
    setJobs(updatedJobs);
    try {
      await updateJobApplication(id, { status: targetStatus });
      showToast(`Updated status to ${targetStatus}`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status.", "error");
      loadJobs();
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="spinner" />
        <p>Loading application tracker...</p>
      </main>
    );
  }

  return (
    <Protected>
      <div className="home-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {/* Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>Job Application <span className="highlight">Tracker</span></h1>
            <p style={{ marginTop: '0.2rem', color: '#aaa' }}>Manage your active applications. Drag cards or use quick controls to change status.</p>
          </div>
          <button onClick={handleOpenCreateModal} className="button primary-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Application
          </button>
        </header>

        {/* Kanban Board Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '1rem',
          alignItems: 'start',
          overflowX: 'auto',
          paddingBottom: '1rem'
        }}>
          {COLUMNS.map((col) => {
            const filteredJobs = jobs.filter(j => j.status === col);
            return (
              <div
                key={col}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col)}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '1rem',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', color: col === 'Offer' ? '#3fb950' : col === 'Rejected' ? '#ff4d4f' : '#fff' }}>
                    {col}
                  </h3>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: '#ccc' }}>
                    {filteredJobs.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                  {filteredJobs.map(job => (
                    <div
                      key={job._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job._id)}
                      className="interview-card"
                      style={{
                        padding: '1rem',
                        cursor: 'grab',
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff', fontWeight: 'bold' }}>{job.role}</h4>
                        <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.85rem', color: 'var(--saas-primary)' }}>{job.company}</p>
                      </div>

                      {job.interviewDate && (
                        <div style={{ fontSize: '0.75rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Int: {new Date(job.interviewDate).toLocaleDateString()}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem' }}>
                        {/* Edit/Delete controls */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(job)}
                            style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
                          >
                            Delete
                          </button>
                        </div>

                        {/* Quick move dropdown for touch devices */}
                        <select
                          value={job.status}
                          onChange={(e) => handleQuickStatusChange(job._id, e.target.value)}
                          style={{
                            background: '#16161a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            color: '#ccc',
                            fontSize: '0.75rem',
                            padding: '0.1rem 0.2rem'
                          }}
                        >
                          {COLUMNS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  {filteredJobs.length === 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', border: '1px dashed rgba(255,255,255,0.03)', borderRadius: '6px', color: '#555', fontSize: '0.85rem' }}>
                      Drop jobs here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Overlay Dialog */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div className="interview-card" style={{ maxWidth: '500px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>

              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                {editingJob ? "Edit Job Application" : "Add Job Application"}
              </h2>

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Company <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Role <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', minHeight: '80px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: '#16161a', color: '#fff', outline: 'none' }}
                    >
                      {COLUMNS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Interview Date</label>
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#ccc' }}>Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', minHeight: '80px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="button secondary-button"
                    style={{ padding: '0.5rem 1.5rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="button primary-button"
                    style={{ padding: '0.5rem 1.5rem' }}
                  >
                    {submitting ? "Saving..." : "Save Application"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </Protected>
  );
}
