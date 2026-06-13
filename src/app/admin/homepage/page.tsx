"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import {
  MOCK_ARTICLES,
  MOCK_ISSUES,
  MOCK_EDITOR_NOTES,
  MOCK_HOMEPAGE_CONFIG,
  HomepageConfig
} from '@/lib/mockDb';

export default function AdminHomepageCuration() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [editorNotes, setEditorNotes] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setConfig(MOCK_HOMEPAGE_CONFIG);
    setArticles(MOCK_ARTICLES);
    setIssues(MOCK_ISSUES);
    setEditorNotes(MOCK_EDITOR_NOTES);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    // Simulate saving the config
    setMessage('Homepage curation configuration updated successfully (simulated).');
    setTimeout(() => {
      setMessage('');
    }, 2500);
  };

  if (!config) return <div>Loading curation configuration...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Homepage Curation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Explicitly configure which essays and issues occupy primary homepage slots.
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

      <form onSubmit={handleSave} className={styles.formCard}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          Active Slots Selection
        </h2>

        <div className={styles.formGrid}>
          {/* Hero Article */}
          <div className={styles.formGroupFull}>
            <label className={styles.label}>Hero Story (Slot 1 - Large display)</label>
            <select
              className={styles.select}
              value={config.heroArticleId}
              onChange={e => setConfig({ ...config, heroArticleId: e.target.value })}
            >
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title} ({getTopicName(art.topicId)})
                </option>
              ))}
            </select>
          </div>

          {/* Featured Essay 1 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Featured Essay 1</label>
            <select
              className={styles.select}
              value={config.featuredEssayIds[0] || ''}
              onChange={e => {
                const updatedIds = [...config.featuredEssayIds];
                updatedIds[0] = e.target.value;
                setConfig({ ...config, featuredEssayIds: updatedIds });
              }}
            >
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Essay 2 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Featured Essay 2</label>
            <select
              className={styles.select}
              value={config.featuredEssayIds[1] || ''}
              onChange={e => {
                const updatedIds = [...config.featuredEssayIds];
                updatedIds[1] = e.target.value;
                setConfig({ ...config, featuredEssayIds: updatedIds });
              }}
            >
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Issue Spotlight */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Issue Spotlight</label>
            <select
              className={styles.select}
              value={config.issueSpotlightId}
              onChange={e => setConfig({ ...config, issueSpotlightId: e.target.value })}
            >
              {issues.map(iss => (
                <option key={iss.id} value={iss.id}>
                  Issue No. {iss.number}: {iss.title}
                </option>
              ))}
            </select>
          </div>

          {/* Archive Highlight */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Archive Highlight Article</label>
            <select
              className={styles.select}
              value={config.archiveHighlightId}
              onChange={e => setConfig({ ...config, archiveHighlightId: e.target.value })}
            >
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Editor Note Notebook */}
          <div className={styles.formGroupFull}>
            <label className={styles.label}>Featured Editor&rsquo;s Note</label>
            <select
              className={styles.select}
              value={config.editorsNoteId}
              onChange={e => setConfig({ ...config, editorsNoteId: e.target.value })}
            >
              {editorNotes.map(note => (
                <option key={note.id} value={note.id}>
                  {note.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.btnGroup}>
          <button type="submit" className={styles.btnPrimary} style={{ width: '100%' }}>
            Publish Layout Curation Config
          </button>
        </div>
      </form>
    </div>
  );
}

function getTopicName(id?: string) {
  switch (id) {
    case 'topic-tech': return 'Technology';
    case 'topic-society': return 'Society';
    case 'topic-philosophy': return 'Philosophy';
    case 'topic-science': return 'Science';
    case 'topic-culture': return 'Culture';
    case 'topic-politics': return 'Politics';
    default: return 'General';
  }
}
