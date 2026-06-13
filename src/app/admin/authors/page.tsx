"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { MOCK_AUTHORS, Author } from '@/lib/mockDb';

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Partial<Author> | null>(null);
  const [message, setMessage] = useState('');
  const [interestsText, setInterestsText] = useState('');

  useEffect(() => {
    setAuthors(MOCK_AUTHORS);
  }, []);

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setInterestsText(author.currentInterests?.join(', ') || '');
    setIsEditing(true);
    setMessage('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    // Parse interests
    const parsedInterests = interestsText
      .split(',')
      .map(i => i.trim())
      .filter(i => i !== '');

    const updatedAuthor = {
      ...editingAuthor,
      currentInterests: parsedInterests
    } as Author;

    const idx = authors.findIndex(a => a.id === updatedAuthor.id);
    let updated = [...authors];

    if (idx > -1) {
      updated[idx] = updatedAuthor;
      setMessage('Contributor details updated successfully (simulated).');
    }

    setAuthors(updated);
    setTimeout(() => {
      setIsEditing(false);
      setEditingAuthor(null);
      setMessage('');
    }, 1200);
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

      {isEditing && editingAuthor ? (
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
