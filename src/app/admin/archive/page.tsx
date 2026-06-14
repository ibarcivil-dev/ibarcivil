"use client";

import React, { useState, useEffect, useMemo } from 'react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { Article } from '@/lib/mockDb';
import { Archive, Search, CheckCircle, AlertCircle, FileEdit } from 'lucide-react';
import Link from 'next/link';

export default function AdminArchive() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const fetchArchiveData = async () => {
    setLoading(true);
    try {
      // Fetch all articles (drafts are not shown in archive)
      const { data: artData } = await supabase
        .from('articles')
        .select('*')
        .in('status', ['published', 'archived'])
        .order('published_at', { ascending: false });

      const { data: authData } = await supabase
        .from('authors')
        .select('*');

      if (artData) {
        setArticles(artData.map((a: any) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          subtitle: a.subtitle,
          excerpt: a.excerpt,
          content: a.content,
          coverUrl: a.cover_url,
          authorId: a.author_id,
          issueId: a.issue_id,
          topicId: a.topic_id,
          status: a.status,
          featured: a.featured,
          homepagePriority: a.homepage_priority,
          readingTime: a.reading_time,
          publishedAt: a.published_at,
          isPerspective: a.is_perspective
        })));
      }

      if (authData) setAuthors(authData);
    } catch (err) {
      console.error('Error fetching archive articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchiveData();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string, title: string) => {
    const newStatus = currentStatus === 'published' ? 'archived' : 'published';
    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setMessage(`"${title}" is now ${newStatus === 'archived' ? 'Archived' : 'Published'}`);
      await fetchArchiveData();

      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (err: any) {
      console.error('Error toggling status:', err);
      setMessage(`Error changing status: ${err.message || err}`);
    }
  };

  const getAuthorName = (id: string) => {
    return authors.find(a => a.id === id)?.name || 'Unknown';
  };

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    return articles.filter(art =>
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getAuthorName(art.authorId).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, searchQuery, authors]);

  // Group filtered articles by year
  const groupedArticles = useMemo(() => {
    const groups: { [year: string]: Article[] } = {};
    filteredArticles.forEach(art => {
      const year = art.publishedAt 
        ? new Date(art.publishedAt).getFullYear().toString() 
        : 'Undated';
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(art);
    });
    // Sort years descending
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .reduce((acc, year) => {
        acc[year] = groups[year].sort(
          (a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
        );
        return acc;
      }, {} as { [year: string]: Article[] });
  }, [filteredArticles]);

  const stats = useMemo(() => {
    const published = articles.filter(a => a.status === 'published').length;
    const archived = articles.filter(a => a.status === 'archived').length;
    return { published, archived, total: articles.length };
  }, [articles]);

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Archive Curation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Curate archived issues, transition published essays to cataloged state, and group directories.
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

      {/* Stats Cards */}
      <div className={styles.statsGrid} style={{ marginBottom: '24px' }}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Cataloged</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Live Published</span>
          <span className={styles.statValue} style={{ color: 'var(--accent)' }}>{stats.published}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Archived Catalog</span>
          <span className={styles.statValue}>{stats.archived}</span>
        </div>
      </div>

      {/* Curation Search Tool */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '12px 16px',
        marginBottom: '32px',
        maxWidth: '450px'
      }}>
        <Search size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search by title or curator..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            width: '100%'
          }}
        />
      </div>

      {loading ? (
        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', padding: '40px 0' }}>
          Loading catalog directories...
        </div>
      ) : Object.keys(groupedArticles).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', margin: 0 }}>No cataloged essays found in system.</p>
        </div>
      ) : (
        /* Year-grouped timeline results matching public archive UX */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {Object.keys(groupedArticles).map(year => (
            <div key={year} style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '32px'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.8rem',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px',
                marginBottom: '20px',
                marginTop: 0
              }}>
                {year}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {groupedArticles[year].map(art => (
                  <div key={art.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 4fr 2fr 2fr 1.5fr',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 0',
                    borderBottom: '1px dashed var(--border)'
                  }}>
                    {/* Date */}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
                      {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>

                    {/* Title */}
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 500 }}>
                      {art.title}
                    </span>

                    {/* Author */}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
                      By {getAuthorName(art.authorId)}
                    </span>

                    {/* Status Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {art.status === 'published' ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          color: 'var(--accent)',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          <CheckCircle size={12} />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          <Archive size={12} />
                          <span>Archived</span>
                        </span>
                      )}
                    </div>

                    {/* Actions Toggles */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleToggleStatus(art.id, art.status, art.title)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          padding: 0
                        }}
                      >
                        {art.status === 'published' ? 'Archive' : 'Publish'}
                      </button>

                      <Link
                        href={art.isPerspective ? `/admin/perspectives` : `/admin/articles`}
                        style={{
                          color: 'var(--text-secondary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          textDecoration: 'none'
                        }}
                      >
                        <FileEdit size={12} />
                        <span>Edit</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
