import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from '../../essays/page.module.css';
import { getTopicBySlug, getArticlesByTopic, getAuthors } from '@/lib/mockDb';

interface TopicProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TopicProps) {
  const resolvedParams = await params;
  const topic = getTopicBySlug(resolvedParams.slug);

  if (!topic) {
    return {
      title: 'Topic Not Found',
    };
  }

  return {
    title: `${topic.name} Essays`,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: TopicProps) {
  const resolvedParams = await params;
  const topic = getTopicBySlug(resolvedParams.slug);

  if (!topic) {
    notFound();
  }

  const articles = getArticlesByTopic(topic.id);
  const authors = getAuthors();

  const getAuthor = (id: string) => authors.find(a => a.id === id);

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '64px' }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--accent)',
          fontWeight: 600,
          display: 'block',
          marginBottom: '8px'
        }}>
          Topic Curation
        </span>
        <h1 className={styles.pageTitle} style={{ borderBottom: 'none', marginBottom: '8px', paddingBottom: '0' }}>
          {topic.name}
        </h1>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: 'var(--text-secondary)',
          fontWeight: 300,
          maxWidth: '60ch',
          marginBottom: '48px',
          borderBottom: '1px solid var(--text-primary)',
          paddingBottom: '24px'
        }}>
          {topic.description}
        </p>
      </div>

      {articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
          There are currently no essays listed under this topic.
        </div>
      ) : (
        <div className={styles.essaysGrid}>
          {articles.map(art => {
            const author = getAuthor(art.authorId);
            return (
              <article key={art.id} className={styles.essayCard}>
                <Link href={`/article/${art.slug}`} className={styles.cardImageLink}>
                  <div className={styles.cardImageContainer}>
                    <Image
                      src={art.coverUrl}
                      alt={art.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                  </div>
                </Link>
                <div className={styles.cardContent}>
                  <span className={styles.cardTag}>{art.isPerspective ? 'Perspective' : 'Essay'}</span>
                  <h3 className={styles.cardTitle}>
                    <Link href={`/article/${art.slug}`}>{art.title}</Link>
                  </h3>
                  <p className={styles.cardExcerpt}>{art.excerpt}</p>
                  
                  <div className={styles.cardMeta}>
                    <span>
                      By{' '}
                      <Link href={`/author/${author?.slug}`} className={styles.authorLink}>
                        {author?.name}
                      </Link>
                    </span>
                    <span>•</span>
                    <span>{art.readingTime} min read</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
