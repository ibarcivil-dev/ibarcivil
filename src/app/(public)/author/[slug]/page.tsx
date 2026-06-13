import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './AuthorPage.module.css';
import { getAuthorBySlug, getArticlesByAuthor, getTopicBySlug } from '@/lib/mockDb';

interface AuthorProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorProps) {
  const resolvedParams = await params;
  const author = getAuthorBySlug(resolvedParams.slug);

  if (!author) {
    return {
      title: 'Author Not Found',
    };
  }

  return {
    title: author.name,
    description: author.bio,
  };
}

export default async function AuthorPage({ params }: AuthorProps) {
  const resolvedParams = await params;
  const author = getAuthorBySlug(resolvedParams.slug);

  if (!author) {
    notFound();
  }

  const articles = getArticlesByAuthor(author.id);

  return (
    <div className={styles.container}>
      {/* 1. AUTHOR PROFILE HEADER [Connection] */}
      <div className={styles.profileGrid}>
        <div className={styles.bioSection}>
          <span className={styles.spec}>{author.specialization}</span>
          <h1 className={styles.name}>{author.name}</h1>
          <p className={styles.bioText}>{author.bio}</p>
        </div>

        {/* Sidebar Info */}
        <aside className={styles.sidebar}>
          {/* Current Interests */}
          {author.currentInterests && author.currentInterests.length > 0 && (
            <div className={styles.sidebarGroup}>
              <h3 className={styles.sidebarTitle}>Current Research</h3>
              <ul className={styles.interestsList}>
                {author.currentInterests.map((interest, i) => (
                  <li key={i}>{interest}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Readings */}
          {author.recommendedReading && author.recommendedReading.length > 0 && (
            <div className={styles.sidebarGroup}>
              <h3 className={styles.sidebarTitle}>Recommended Readings</h3>
              <ul className={styles.recReadingList}>
                {author.recommendedReading.map((rec, i) => (
                  <li key={i} className={styles.recItem}>
                    <span className={styles.recTitle}>{rec.title}</span>
                    <span className={styles.recAuthor}>By {rec.author}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* 2. ARTICLES RIVER */}
      <div className={styles.riverSection}>
        <h2 className={styles.riverTitle}>Published Work</h2>

        {articles.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>
            No essays published yet.
          </p>
        ) : (
          <div className={styles.river}>
            {articles.map(art => (
              <div key={art.id} className={styles.riverItem}>
                <div>
                  <h3 className={styles.artTitle}>
                    <Link href={`/article/${art.slug}`}>{art.title}</Link>
                  </h3>
                  <p className={styles.artExcerpt}>{art.excerpt}</p>
                  <div className={styles.artMeta}>
                    <span>
                      {new Date(art.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span>{art.readingTime} min read</span>
                  </div>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: 'var(--muted)', overflow: 'hidden' }}>
                  <Image
                    src={art.coverUrl}
                    alt={art.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="150px"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
