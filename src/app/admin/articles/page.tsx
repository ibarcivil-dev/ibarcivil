"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { Article, ArticleStatus } from '@/lib/mockDb';

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper mapping functions
  const mapToLocalArticle = (dbArticle: any): Article => ({
    id: dbArticle.id,
    slug: dbArticle.slug,
    title: dbArticle.title,
    subtitle: dbArticle.subtitle,
    excerpt: dbArticle.excerpt,
    content: dbArticle.content,
    coverUrl: dbArticle.cover_url,
    authorId: dbArticle.author_id,
    issueId: dbArticle.issue_id,
    topicId: dbArticle.topic_id,
    status: dbArticle.status,
    featured: dbArticle.featured,
    homepagePriority: dbArticle.homepage_priority,
    readingTime: dbArticle.reading_time,
    publishedAt: dbArticle.published_at,
    isPerspective: dbArticle.is_perspective
  });

  const mapToDbArticle = (localArticle: Partial<Article>) => ({
    slug: localArticle.slug,
    title: localArticle.title,
    subtitle: localArticle.subtitle,
    excerpt: localArticle.excerpt,
    content: localArticle.content,
    cover_url: localArticle.coverUrl || '/images/articles/convenience.jpg',
    author_id: localArticle.authorId,
    topic_id: localArticle.topicId || null,
    issue_id: localArticle.issueId || null,
    status: localArticle.status || 'draft',
    featured: localArticle.featured || false,
    homepage_priority: localArticle.homepagePriority ?? 0,
    reading_time: localArticle.readingTime ?? 5,
    published_at: localArticle.publishedAt,
    is_perspective: localArticle.isPerspective || false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: artData } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: authData } = await supabase
        .from('authors')
        .select('*')
        .order('name');

      const { data: topData } = await supabase
        .from('topics')
        .select('*')
        .order('name');

      if (artData) setArticles(artData.map(mapToLocalArticle));
      if (authData) setAuthors(authData);
      if (topData) setTopics(topData);
    } catch (err) {
      console.error('Error fetching admin article data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsEditing(true);
    setMessage('');
  };

  const handleCreate = () => {
    setEditingArticle({
      id: `art-new-${Date.now()}`,
      title: '',
      subtitle: '',
      excerpt: '',
      content: '',
      slug: '',
      authorId: authors[0]?.id || '',
      topicId: topics[0]?.id || '',
      status: 'draft',
      featured: false,
      homepagePriority: 0,
      readingTime: 10,
      coverUrl: '/images/articles/convenience.jpg',
      publishedAt: new Date().toISOString(),
      isPerspective: false
    });
    setIsEditing(true);
    setMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      const isNew = editingArticle.id?.startsWith('art-new-');
      const dbPayload = mapToDbArticle(editingArticle);

      if (isNew) {
        const { error } = await supabase
          .from('articles')
          .insert([dbPayload]);

        if (error) throw error;
        setMessage('Article created successfully in database.');
      } else {
        const { error } = await supabase
          .from('articles')
          .update(dbPayload)
          .eq('id', editingArticle.id);

        if (error) throw error;
        setMessage('Article updated successfully in database.');
      }

      await fetchData();

      setTimeout(() => {
        setIsEditing(false);
        setEditingArticle(null);
        setMessage('');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving article:', err);
      setMessage(`Error saving: ${err.message || err}`);
    }
  };

  const getAuthorName = (id: string) => {
    return authors.find(a => a.id === id)?.name || 'Unknown';
  };

  const getTopicName = (id?: string) => {
    return topics.find(t => t.id === id)?.name || 'None';
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Articles</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage publication flow, editor statuses, and priority flags.
          </p>
        </div>
        {!isEditing && (
          <button onClick={handleCreate} className={styles.btnPrimary} disabled={loading}>
            Create Article
          </button>
        )}
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

      {loading && !isEditing ? (
        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', padding: '40px 0' }}>
          Loading articles from database...
        </div>
      ) : isEditing && editingArticle ? (
        /* Form view */
        <form onSubmit={handleSave} className={styles.formCard}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '24px' }}>
            {editingArticle.id?.startsWith('art-new-') ? 'Create Article' : 'Edit Article'}
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Article Title</label>
              <input
                type="text"
                required
                className={styles.input}
                value={editingArticle.title || ''}
                onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Slug / URL path</label>
              <input
                type="text"
                required
                placeholder="the-tyranny-of-convenience"
                className={styles.input}
                value={editingArticle.slug || ''}
                onChange={e => setEditingArticle({ ...editingArticle, slug: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Subtitle / Deck</label>
              <input
                type="text"
                required
                className={styles.input}
                value={editingArticle.subtitle || ''}
                onChange={e => setEditingArticle({ ...editingArticle, subtitle: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Excerpt (Homepage Preview)</label>
              <textarea
                required
                className={styles.textarea}
                value={editingArticle.excerpt || ''}
                onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Content Body (Markdown Supported)</label>
              <textarea
                required
                className={styles.textarea}
                style={{ minHeight: '280px' }}
                value={editingArticle.content || ''}
                onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Author</label>
              <select
                className={styles.select}
                value={editingArticle.authorId || ''}
                onChange={e => setEditingArticle({ ...editingArticle, authorId: e.target.value })}
              >
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Topic</label>
              <select
                className={styles.select}
                value={editingArticle.topicId || ''}
                onChange={e => setEditingArticle({ ...editingArticle, topicId: e.target.value })}
              >
                <option value="">None</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Publication Status</label>
              <select
                className={styles.select}
                value={editingArticle.status || 'draft'}
                onChange={e => setEditingArticle({ ...editingArticle, status: e.target.value as ArticleStatus })}
              >
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Homepage priority score</label>
              <input
                type="number"
                className={styles.input}
                value={editingArticle.homepagePriority || 0}
                onChange={e => setEditingArticle({ ...editingArticle, homepagePriority: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Reading time (minutes)</label>
              <input
                type="number"
                className={styles.input}
                value={editingArticle.readingTime || 5}
                onChange={e => setEditingArticle({ ...editingArticle, readingTime: parseInt(e.target.value) || 5 })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editingArticle.isPerspective || false}
                  onChange={e => setEditingArticle({ ...editingArticle, isPerspective: e.target.checked })}
                />
                Is Perspective (Opinion/Viewpoint)
              </label>
            </div>
          </div>

          <div className={styles.btnGroup}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setIsEditing(false);
                setEditingArticle(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary}>
              Save Article
            </button>
          </div>
        </form>
      ) : (
        /* List view */
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Title</th>
                <th className={styles.th}>Author</th>
                <th className={styles.th}>Topic</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Priority</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className={styles.tr}>
                  <td className={styles.td} style={{ fontWeight: 500, fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                    {article.title}
                  </td>
                  <td className={styles.td}>{getAuthorName(article.authorId)}</td>
                  <td className={styles.td}>{getTopicName(article.topicId)}</td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${article.status === 'published' ? styles.badgePublished : styles.badgeDraft}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className={styles.td}>{article.homepagePriority}</td>
                  <td className={styles.td}>
                    <span className={styles.actionLink} onClick={() => handleEdit(article)}>
                      Edit
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
