"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { Issue } from '@/lib/mockDb';

export default function AdminIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Partial<Issue> | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Mapping Helpers
  const mapToLocalIssue = (dbIssue: any): Issue => ({
    id: dbIssue.id,
    number: dbIssue.number,
    title: dbIssue.title,
    description: dbIssue.description,
    coverUrl: dbIssue.cover_url,
    theme: dbIssue.theme,
    editorNote: dbIssue.editor_note,
    publishedAt: dbIssue.published_at
  });

  const mapToDbIssue = (localIssue: Partial<Issue>) => ({
    number: localIssue.number,
    title: localIssue.title,
    description: localIssue.description,
    cover_url: localIssue.coverUrl || '/images/issues/cover-12.jpg',
    theme: localIssue.theme,
    editor_note: localIssue.editorNote,
    published_at: localIssue.publishedAt || new Date().toISOString()
  });

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('number', { ascending: false });
      if (error) throw error;
      if (data) setIssues(data.map(mapToLocalIssue));
    } catch (err) {
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
    setIsEditing(true);
    setMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;

    try {
      const dbPayload = mapToDbIssue(editingIssue);
      const { error } = await supabase
        .from('issues')
        .update(dbPayload)
        .eq('id', editingIssue.id);

      if (error) throw error;
      setMessage('Issue curation saved successfully in database.');
      await fetchIssues();

      setTimeout(() => {
        setIsEditing(false);
        setEditingIssue(null);
        setMessage('');
      }, 1200);
    } catch (err: any) {
      console.error('Error saving issue:', err);
      setMessage(`Error saving: ${err.message || err}`);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Issues</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Curate publication theme issues, cover layouts, and compile editorial letters.
          </p>
        </div>
      </div>

      {message && (
        <div style={{
          backgroundColor: 'var(--muted)',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          padding: '16px',
          marginBottom: '24px',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}

      {loading ? (
        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', padding: '40px 0' }}>
          Loading issues from database...
        </div>
      ) : isEditing && editingIssue ? (
        <form onSubmit={handleSave} className={styles.formCard}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '24px' }}>
            Edit Issue No. {editingIssue.number}
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Issue Title</label>
              <input
                type="text"
                required
                className={styles.input}
                value={editingIssue.title || ''}
                onChange={e => setEditingIssue({ ...editingIssue, title: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Theme Label</label>
              <input
                type="text"
                required
                className={styles.input}
                value={editingIssue.theme || ''}
                onChange={e => setEditingIssue({ ...editingIssue, theme: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Description Overview</label>
              <textarea
                required
                className={styles.textarea}
                value={editingIssue.description || ''}
                onChange={e => setEditingIssue({ ...editingIssue, description: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Editor&rsquo;s Note / Manifesto Letter</label>
              <textarea
                required
                className={styles.textarea}
                style={{ minHeight: '200px' }}
                value={editingIssue.editorNote || ''}
                onChange={e => setEditingIssue({ ...editingIssue, editorNote: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.btnGroup}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setIsEditing(false);
                setEditingIssue(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Save Issue
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Issue No.</th>
                <th className={styles.th}>Title</th>
                <th className={styles.th}>Theme</th>
                <th className={styles.th}>Publish Date</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map(issue => (
                <tr key={issue.id} className={styles.tr}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>No. {issue.number}</td>
                  <td className={styles.td} style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                    {issue.title}
                  </td>
                  <td className={styles.td}>{issue.theme}</td>
                  <td className={styles.td}>
                    {new Date(issue.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.actionLink} onClick={() => handleEdit(issue)}>
                      Edit Curation
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
