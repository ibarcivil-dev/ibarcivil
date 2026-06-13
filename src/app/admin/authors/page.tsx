"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { Author } from '@/lib/mockDb';

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Partial<Author> | null>(null);
  const [message, setMessage] = useState('');
  const [interestsText, setInterestsText] = useState('');
  const [loading, setLoading] = useState(true);

  // Mapping Helpers
  const mapToLocalAuthor = (dbAuthor: any): Author => ({
    id: dbAuthor.id,
    name: dbAuthor.name,
    slug: dbAuthor.slug,
    avatarUrl: dbAuthor.avatar_url,
    bio: dbAuthor.bio,
    specialization: dbAuthor.specialization,
    currentInterests: dbAuthor.current_interests || [],
    recommendedReading: dbAuthor.recommended_reading || []
  });

  const mapToDbAuthor = (localAuthor: Partial<Author>) => ({
    name: localAuthor.name,
    slug: localAuthor.slug || localAuthor.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    avatar_url: localAuthor.avatarUrl || '/images/authors/elena.jpg',
    bio: localAuthor.bio,
    specialization: localAuthor.specialization,
    current_interests: localAuthor.currentInterests || [],
    recommended_reading: localAuthor.recommendedReading || []
  });

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .order('name');
      if (error) throw error;
      if (data) setAuthors(data.map(mapToLocalAuthor));
    } catch (err) {
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setInterestsText(author.currentInterests?.join(', ') || '');
    setIsEditing(true);
    setMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    // Parse interests
    const parsedInterests = interestsText
      .split(',')
      .map(i => i.trim())
      .filter(i => i !== '');

    const updatedLocal = {
      ...editingAuthor,
      currentInterests: parsedInterests
    };

    try {
      const dbPayload = mapToDbAuthor(updatedLocal);
      const { error } = await supabase
        .from('authors')
        .update(dbPayload)
        .eq('id', editingAuthor.id);

      if (error) throw error;
      setMessage('Contributor details updated successfully in database.');
      await fetchAuthors();

      setTimeout(() => {
        setIsEditing(false);
        setEditingAuthor(null);
        setMessage('');
      }, 1200);
    } catch (err: any) {
      console.error('Error saving author:', err);
      setMessage(`Error saving: ${err.message || err}`);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Authors</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage writer biographies, research focus, and current scholarly interests.
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
          Loading contributors from database...
        </div>
      ) : isEditing && editingAuthor ? (
        <form onSubmit={handleSave} className={styles.formCard}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '24px' }}>
            Edit Contributor: {editingAuthor.name}
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                required
                className={styles.input}
                value={editingAuthor.name || ''}
                onChange={e => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Editorial Specialization</label>
              <input
                type="text"
                required
                className={styles.input}
                placeholder="Philosophy & Society"
                value={editingAuthor.specialization || ''}
                onChange={e => setEditingAuthor({ ...editingAuthor, specialization: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Scholarly Bio (Short description)</label>
              <textarea
                required
                className={styles.textarea}
                value={editingAuthor.bio || ''}
                onChange={e => setEditingAuthor({ ...editingAuthor, bio: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Current Research Interests (Comma separated)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Byzantine masonry, spatial politics, analogue archiving"
                value={interestsText}
                onChange={e => setInterestsText(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.btnGroup}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setIsEditing(false);
                setEditingAuthor(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Save Details
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Name</th>
                <th className={styles.th}>Specialization</th>
                <th className={styles.th}>Bio</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map(author => (
                <tr key={author.id} className={styles.tr}>
                  <td className={styles.td} style={{ fontWeight: 600, fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                    {author.name}
                  </td>
                  <td className={styles.td} style={{ color: 'var(--accent)', fontWeight: 500 }}>
                    {author.specialization}
                  </td>
                  <td className={styles.td} style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {author.bio}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.actionLink} onClick={() => handleEdit(author)}>
                      Edit Profile
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
