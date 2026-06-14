"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { Article } from '@/lib/mockDb';

export default function AdminPerspectives() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: artData } = await supabase
        .from('articles')
        .select('*')
        .eq('is_perspective', true) // Only query perspectives
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
      console.error('Error fetching admin perspectives data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <h1 className={styles.pageTitle}>Perspectives</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage editorial columns, opinions, and viewpoint arguments.
          </p>
        </div>
        <Link href="/admin/perspectives/create" className={styles.btnPrimary} style={{ textDecoration: 'none' }}>
          Create Perspective
        </Link>
      </div>

      {loading ? (
        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', padding: '40px 0' }}>
          Loading perspectives from database...
        </div>
      ) : (
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
                    <Link href={`/admin/perspectives/${article.id}`} className={styles.actionLink} style={{ textDecoration: 'none' }}>
                      Edit
                    </Link>
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
