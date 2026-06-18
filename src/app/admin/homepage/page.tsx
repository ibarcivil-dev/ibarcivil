"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { HomepageConfig } from '@/lib/mockDb';

export default function AdminHomepageCuration() {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [configId, setConfigId] = useState<string | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [editorNotes, setEditorNotes] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch auxiliary lists
      const { data: artData } = await supabase.from('articles').select('*');
      const { data: issData } = await supabase.from('issues').select('*');
      const { data: noteData } = await supabase.from('editor_notes').select('*');

      if (artData) setArticles(artData);
      if (issData) setIssues(issData);
      if (noteData) setEditorNotes(noteData);

      // 2. Fetch homepage config
      const { data: configs } = await supabase.from('homepage_configs').select('*');
      let activeConfig = configs?.[0];

      if (!activeConfig && artData && artData.length > 0) {
        // Insert a default configuration if none exists
        const placeholder = {
          hero_article_id: artData[0]?.id || null,
          featured_essay_ids: artData.slice(1, 3).map((a: any) => a.id) || [],
          issue_spotlight_id: issData?.[0]?.id || null,
          archive_highlight_id: artData[2]?.id || null,
          editors_note_id: noteData?.[0]?.id || null
        };

        const { data: inserted } = await supabase
          .from('homepage_configs')
          .insert([placeholder])
          .select();

        activeConfig = inserted?.[0];
      }

      if (activeConfig) {
        setConfig({
          heroArticleId: activeConfig.hero_article_id || '',
          featuredEssayIds: activeConfig.featured_essay_ids || [],
          issueSpotlightId: activeConfig.issue_spotlight_id || '',
          archiveHighlightId: activeConfig.archive_highlight_id || '',
          editorsNoteId: activeConfig.editors_note_id || ''
        });
        setConfigId(activeConfig.id);
      }
    } catch (err) {
      console.error('Error loading homepage config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config || !configId) return;

    try {
      const dbPayload = {
        hero_article_id: config.heroArticleId || null,
        featured_essay_ids: config.featuredEssayIds || [],
        issue_spotlight_id: config.issueSpotlightId || null,
        archive_highlight_id: config.archiveHighlightId || null,
        editors_note_id: config.editorsNoteId || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('homepage_configs')
        .update(dbPayload)
        .eq('id', configId);

      if (error) throw error;

      setMessage('Homepage curation configuration updated successfully in database.');
      setTimeout(() => {
        setMessage('');
      }, 2500);
    } catch (err: any) {
      console.error('Error saving homepage config:', err);
      setMessage(`Error saving configuration: ${err.message || err}`);
    }
  };

  if (loading) return <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', padding: '40px' }}>Loading configuration from database...</div>;
  if (!config) return <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', padding: '40px' }}>No articles or database rows found to configure the homepage.</div>;

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
              <option value="">None</option>
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Essay 1 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Featured Essay 1 (Hero)</label>
            <select
              className={styles.select}
              value={config.featuredEssayIds[0] || ''}
              onChange={e => {
                const updatedIds = [...config.featuredEssayIds];
                updatedIds[0] = e.target.value;
                setConfig({ ...config, featuredEssayIds: updatedIds });
              }}
            >
              <option value="">None</option>
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Essay 2 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Featured Essay 2 (Secondary 1)</label>
            <select
              className={styles.select}
              value={config.featuredEssayIds[1] || ''}
              onChange={e => {
                const updatedIds = [...config.featuredEssayIds];
                updatedIds[1] = e.target.value;
                setConfig({ ...config, featuredEssayIds: updatedIds });
              }}
            >
              <option value="">None</option>
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Essay 3 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Featured Essay 3 (Secondary 2)</label>
            <select
              className={styles.select}
              value={config.featuredEssayIds[2] || ''}
              onChange={e => {
                const updatedIds = [...config.featuredEssayIds];
                updatedIds[2] = e.target.value;
                setConfig({ ...config, featuredEssayIds: updatedIds });
              }}
            >
              <option value="">None</option>
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Essay 4 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Featured Essay 4 (Visual)</label>
            <select
              className={styles.select}
              value={config.featuredEssayIds[3] || ''}
              onChange={e => {
                const updatedIds = [...config.featuredEssayIds];
                updatedIds[3] = e.target.value;
                setConfig({ ...config, featuredEssayIds: updatedIds });
              }}
            >
              <option value="">None</option>
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Essay 5 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Featured Essay 5 (Highlight)</label>
            <select
              className={styles.select}
              value={config.featuredEssayIds[4] || ''}
              onChange={e => {
                const updatedIds = [...config.featuredEssayIds];
                updatedIds[4] = e.target.value;
                setConfig({ ...config, featuredEssayIds: updatedIds });
              }}
            >
              <option value="">None</option>
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  {art.title}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Essay 6 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Featured Essay 6 (Spotlight)</label>
            <select
              className={styles.select}
              value={config.featuredEssayIds[5] || ''}
              onChange={e => {
                const updatedIds = [...config.featuredEssayIds];
                updatedIds[5] = e.target.value;
                setConfig({ ...config, featuredEssayIds: updatedIds });
              }}
            >
              <option value="">None</option>
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
              <option value="">None</option>
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
              <option value="">None</option>
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
              <option value="">None</option>
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
