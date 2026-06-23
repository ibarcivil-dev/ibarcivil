"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Tag,
  Globe,
} from 'lucide-react';

type Submission = {
  id: string;
  author_name: string;
  author_email: string;
  author_bio: string;
  title: string;
  subtitle: string;
  abstract: string;
  content: string;
  category: string;
  language: string;
  notes: string;
  status: 'pending' | 'accepted' | 'rejected';
  submitted_at: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--text-secondary)',
  accepted: 'var(--accent)',
  rejected: 'rgb(239, 68, 68)',
};

const STATUS_BG: Record<string, string> = {
  pending: 'var(--muted)',
  accepted: 'rgba(122, 62, 43, 0.08)',
  rejected: 'rgba(239, 68, 68, 0.06)',
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [selected, setSelected] = useState<Submission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (data) setSubmissions(data as Submission[]);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStatus = async (id: string, newStatus: 'accepted' | 'rejected') => {
    setActionLoading(true);
    try {
      await supabase.from('submissions').update({ status: newStatus }).eq('id', id);
      setSubmissions(prev =>
        prev.map(s => (s.id === id ? { ...s, status: newStatus } : s))
      );
      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch (err) {
      console.error('Error updating submission status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);

  const counts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    accepted: submissions.filter(s => s.status === 'accepted').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Submissions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Review, accept, or decline reader article submissions.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '2px',
        marginBottom: '32px',
        borderBottom: '1px solid var(--border)'
      }}>
        {(['all', 'pending', 'accepted', 'rejected'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '10px 20px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              borderBottom: filter === tab ? '2px solid var(--text-primary)' : '2px solid transparent',
              color: filter === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-1px',
              transition: 'all 0.15s ease',
            }}
          >
            {tab}
            <span style={{
              padding: '2px 6px',
              borderRadius: '2px',
              backgroundColor: tab === 'pending' && counts.pending > 0 ? 'var(--accent)' : 'var(--muted)',
              color: tab === 'pending' && counts.pending > 0 ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', padding: '40px 0' }}>
          Loading submissions…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          padding: '60px 0',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.95rem',
          borderTop: '1px solid var(--border)'
        }}>
          No {filter !== 'all' ? filter : ''} submissions found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {filtered.map(sub => {
            const isExpanded = expandedId === sub.id;
            return (
              <div
                key={sub.id}
                style={{
                  borderTop: '1px solid var(--border)',
                  backgroundColor: isExpanded ? 'var(--surface)' : 'transparent',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {/* Row Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px 24px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {/* Title + Meta */}
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.1rem',
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                    }}>
                      {sub.title}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} /> {sub.author_name}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {formatDate(sub.submitted_at || sub.created_at)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tag size={12} /> {sub.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={12} /> {sub.language}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span style={{
                    padding: '4px 10px',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: STATUS_COLORS[sub.status],
                    backgroundColor: STATUS_BG[sub.status],
                    border: `1px solid ${STATUS_COLORS[sub.status]}`,
                    borderRadius: '1px',
                    whiteSpace: 'nowrap',
                  }}>
                    {sub.status}
                  </span>

                  {/* Quick Actions */}
                  {sub.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => updateStatus(sub.id, 'accepted')}
                        disabled={actionLoading}
                        title="Accept"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'var(--accent)',
                          backgroundColor: 'rgba(122, 62, 43, 0.08)',
                          border: '1px solid var(--accent)',
                          cursor: 'pointer',
                          transition: 'opacity 0.15s ease',
                        }}
                      >
                        <CheckCircle size={13} /> Accept
                      </button>
                      <button
                        onClick={() => updateStatus(sub.id, 'rejected')}
                        disabled={actionLoading}
                        title="Reject"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '5px',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'rgb(239, 68, 68)',
                          backgroundColor: 'rgba(239, 68, 68, 0.06)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          cursor: 'pointer',
                          transition: 'opacity 0.15s ease',
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  )}

                  {sub.status !== 'pending' && (
                    <div style={{ width: 140 }} /> // spacing placeholder
                  )}

                  {/* Expand toggle */}
                  <div style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div style={{
                    padding: '0 24px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    borderTop: '1px solid var(--border)',
                  }}>
                    {/* Author info */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', paddingTop: '24px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '4px' }}>Author</div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{sub.author_name}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={11} /> Email</span>
                        </div>
                        <a href={`mailto:${sub.author_email}`} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--accent)', textDecoration: 'none' }}>
                          {sub.author_email}
                        </a>
                      </div>
                      {sub.subtitle && (
                        <div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '4px' }}>Subtitle</div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{sub.subtitle}</div>
                        </div>
                      )}
                    </div>

                    {/* Author Bio */}
                    {sub.author_bio && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '8px' }}>Author Bio</div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{sub.author_bio}</p>
                      </div>
                    )}

                    {/* Abstract */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '8px' }}>Abstract</div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.8', margin: 0 }}>{sub.abstract}</p>
                    </div>

                    {/* Full content preview */}
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '8px' }}>Full Text</div>
                      <div style={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        padding: '24px',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        lineHeight: '1.8',
                        maxHeight: '320px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        direction: sub.language === 'urdu' ? 'rtl' : 'ltr',
                        textAlign: sub.language === 'urdu' ? 'right' : 'left',
                      }}>
                        {sub.content}
                      </div>
                    </div>

                    {/* Notes */}
                    {sub.notes && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '8px' }}>Notes to Editors</div>
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>{sub.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons (bottom) */}
                    {sub.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                        <button
                          onClick={() => updateStatus(sub.id, 'accepted')}
                          disabled={actionLoading}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#fff',
                            backgroundColor: 'var(--accent)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'opacity 0.15s ease',
                          }}
                        >
                          <CheckCircle size={15} /> Accept & Forward to Publishing
                        </button>
                        <button
                          onClick={() => updateStatus(sub.id, 'rejected')}
                          disabled={actionLoading}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px',
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: 'rgb(239, 68, 68)',
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            cursor: 'pointer',
                            transition: 'opacity 0.15s ease',
                          }}
                        >
                          <XCircle size={15} /> Decline
                        </button>
                      </div>
                    )}

                    {sub.status !== 'pending' && (
                      <div style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        color: STATUS_COLORS[sub.status],
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        {sub.status === 'accepted' ? <CheckCircle size={15} /> : <XCircle size={15} />}
                        This submission has been <strong>{sub.status}</strong>.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ borderTop: '1px solid var(--border)' }} />
        </div>
      )}
    </div>
  );
}
