"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import {
  MOCK_ARTICLES,
  MOCK_AUTHORS,
  MOCK_ISSUES,
  MOCK_TOPICS,
  Article,
  ArticleStatus
} from '@/lib/mockDb';

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Read initial static data
    setArticles(MOCK_ARTICLES);
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
      authorId: MOCK_AUTHORS[0]?.id || '',
      topicId: MOCK_TOPICS[0]?.id || '',
      status: 'draft',
      featured: false,
      homepagePriority: 0,
      readingTime: 10,
      coverUrl: '/images/articles/convenience.jpg',
      publishedAt: new Date().toISOString()
    });
    setIsEditing(true);
    setMessage('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    // Simulate saving
    const articleIndex = articles.findIndex(a => a.id === editingArticle.id);
    let updatedList = [...articles];

    if (articleIndex > -1) {
      // Edit existing
      updatedList[articleIndex] = editingArticle as Article;
      setMessage('Article updated successfully (simulated).');
    } else {
      // Add new
      updatedList.unshift(editingArticle as Article);
      setMessage('New article created successfully (simulated).');
    }

    setArticles(updatedList);
    setTimeout(() => {
      setIsEditing(false);
      setEditingArticle(null);
      setMessage('');
    }, 1500);
  };

  const getAuthorName = (id: string) => {
    return MOCK_AUTHORS.find(a => a.id === id)?.name || 'Unknown';
  };

  const getTopicName = (id?: string) => {
    return MOCK_TOPICS.find(t => t.id === id)?.name || 'None';
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
          <button onClick={handleCreate} className={styles.btnPrimary}>
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

      {isEditing && editingArticle ? (
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
                {MOCK_AUTHORS.map(author => (
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
                {MOCK_TOPICS.map(topic => (
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
