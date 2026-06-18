import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getEssays, getAuthors } from '@/lib/mockDb';

export const metadata = {
  title: 'Essays',
  description: 'Explore long-form essays, ideas, and deep thinking on culture, technology, philosophy, and society.',
};

export default async function EssaysPage() {
  const essays = getEssays();
  const authors = getAuthors();

  const getAuthor = (id: string) => authors.find(a => a.id === id);

  const featuredEssay = essays[0];
  const gridEssays = essays.slice(1);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Essays</h1>

      {/* Featured Essay */}
      {featuredEssay && (
        <div className={styles.featuredSection}>
          <div className={styles.featuredCard}>
            <Link href={`/article/${featuredEssay.slug}`} className={styles.featuredImageLink}>
              <div className={styles.featuredImageContainer}>
                <Image
                  src={featuredEssay.coverUrl}
                  alt={featuredEssay.title}
                  fill
                  priority
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 900px) 100vw, 600px"
                />
              </div>
            </Link>
            <div className={styles.featuredContent}>
              <span className={styles.tag}>Featured Essay</span>
              <h2 className={styles.featuredTitle}>
                <Link href={`/article/${featuredEssay.slug}`}>{featuredEssay.title}</Link>
              </h2>
              <p className={styles.featuredExcerpt}>{featuredEssay.excerpt}</p>
              
              <div className={styles.meta}>
                <span>
                  By{' '}
                  <Link href={`/author/${getAuthor(featuredEssay.authorId)?.slug}`} className={styles.authorLink}>
                    {getAuthor(featuredEssay.authorId)?.name}
                  </Link>
                </span>
                <span>•</span>
                <span>
                  {new Date(featuredEssay.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>{featuredEssay.readingTime} min read</span>
              </div>
              <Link href={`/article/${featuredEssay.slug}`} className={styles.readBtn}>
                Read
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid Essays */}
      {gridEssays.length > 0 && (
        <div className={styles.gridSection}>
          <h2 className={styles.gridSectionTitle}>More Essays</h2>
          <div className={styles.essaysGrid}>
            {gridEssays.map(essay => {
              const author = getAuthor(essay.authorId);
              return (
                <article key={essay.id} className={styles.essayCard}>
                  <Link href={`/article/${essay.slug}`} className={styles.cardImageLink}>
                    <div className={styles.cardImageContainer}>
                      <Image
                        src={essay.coverUrl}
                        alt={essay.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 360px"
                      />
                    </div>
                  </Link>
                  <div className={styles.cardContent}>
                    <span className={styles.cardTag}>Essay</span>
                    <h3 className={styles.cardTitle}>
                      <Link href={`/article/${essay.slug}`}>{essay.title}</Link>
                    </h3>
                    <p className={styles.cardExcerpt}>{essay.excerpt}</p>
                    
                    <div className={styles.cardMeta}>
                      <span>
                        By{' '}
                        <Link href={`/author/${author?.slug}`} className={styles.authorLink}>
                          {author?.name}
                        </Link>
                      </span>
                      <span>•</span>
                      <span>{essay.readingTime} min read</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

