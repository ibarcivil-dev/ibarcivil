"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import {
  getArticles,
  getAuthors,
  getTopics,
  getIssues,
} from '@/lib/mockDb';

export default function ArchivePage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const articles = useMemo(() => getArticles(), []);
  const authors = useMemo(() => getAuthors(), []);
  const topics = useMemo(() => getTopics(), []);
  const issues = useMemo(() => getIssues(), []);

  // Filter logic
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      if (selectedTopic && art.topicId !== selectedTopic) return false;
      if (selectedAuthor && art.authorId !== selectedAuthor) return false;
      if (selectedIssue && art.issueId !== selectedIssue) return false;
      return true;
    });
  }, [articles, selectedTopic, selectedAuthor, selectedIssue]);

  // Group by year
  const groupedArticles = useMemo(() => {
    const groups: { [year: string]: typeof articles } = {};
    filteredArticles.forEach(art => {
      const year = new Date(art.publishedAt).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(art);
    });
    // Sort years descending
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .reduce((acc, year) => {
        // Sort articles in year descending
        acc[year] = groups[year].sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        return acc;
      }, {} as typeof groups);
  }, [filteredArticles]);

  const getAuthorName = (id: string) => {
    return authors.find(a => a.id === id)?.name || 'Unknown';
  };

  const getTopicName = (id?: string) => {
    if (!id) return '';
    return topics.find(t => t.id === id)?.name || '';
  };

  const handleResetFilters = () => {
    setSelectedTopic(null);
    setSelectedAuthor(null);
    setSelectedIssue(null);
  };

  const hasActiveFilters = selectedTopic || selectedAuthor || selectedIssue;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Archive</h1>

      <div className={styles.layout}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--accent)',
                textAlign: 'left',
                borderBottom: '1px solid var(--accent)',
                paddingBottom: '2px',
                alignSelf: 'flex-start',
              }}
            >
              Reset Filters
            </button>
          )}

          {/* Topics Filter */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Topics</h3>
            <ul className={styles.filterList}>
              {topics.map(t => (
                <li
                  key={t.id}
                  className={`${styles.filterItem} ${selectedTopic === t.id ? styles.active : ''}`}
                  onClick={() => setSelectedTopic(selectedTopic === t.id ? null : t.id)}
                >
                  <span>{t.name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                    ({articles.filter(a => a.topicId === t.id).length})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Authors Filter */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Authors</h3>
            <ul className={styles.filterList}>
              {authors.map(a => (
                <li
                  key={a.id}
                  className={`${styles.filterItem} ${selectedAuthor === a.id ? styles.active : ''}`}
                  onClick={() => setSelectedAuthor(selectedAuthor === a.id ? null : a.id)}
                >
                  <span>{a.name}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                    ({articles.filter(art => art.authorId === a.id).length})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Issues Filter */}
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Issues</h3>
            <ul className={styles.filterList}>
              {issues.map(i => (
                <li
                  key={i.id}
                  className={`${styles.filterItem} ${selectedIssue === i.id ? styles.active : ''}`}
                  onClick={() => setSelectedIssue(selectedIssue === i.id ? null : i.id)}
                >
                  <span>Issue {i.number}: {i.title.substring(0, 15)}...</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>
                    ({articles.filter(art => art.issueId === i.id).length})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Timeline Results [Rediscovery] */}
        <section className={styles.timeline}>
          {Object.keys(groupedArticles).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
              <p>No archived essays match the selected filters.</p>
            </div>
          ) : (
            Object.keys(groupedArticles).map(year => (
              <div key={year} className={styles.yearSection}>
                <h2 className={styles.yearHeader}>{year}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {groupedArticles[year].map(art => (
                    <div key={art.id} className={styles.articleRow}>
                      <span className={styles.date}>
                        {new Date(art.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <Link href={`/article/${art.slug}`} className={styles.artTitle}>
                        {art.title}
                      </Link>
                      <span className={styles.meta}>
                        By {getAuthorName(art.authorId)}
                        <br />
                        <span style={{ color: 'var(--accent)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          {getTopicName(art.topicId)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
