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

  return (
    <div className={styles.river}>
      <h1 className={styles.riverTitle}>Essays</h1>

      {essays.map(essay => {
        const author = getAuthor(essay.authorId);
        return (
          <div key={essay.id} className={styles.riverItem}>
            <div className={styles.riverItemContent}>
              <span className={styles.riverItemTag}>Essay</span>
              <h2 className={styles.riverItemTitle}>
                <Link href={`/article/${essay.slug}`}>{essay.title}</Link>
              </h2>
              <p className={styles.riverItemExcerpt}>{essay.excerpt}</p>
              
              <div className={styles.riverItemMeta}>
                <span>
                  By{' '}
                  <Link href={`/author/${author?.slug}`} style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                    {author?.name}
                  </Link>
                </span>
                <span>•</span>
                <span>
                  {new Date(essay.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span>{essay.readingTime} min read</span>
              </div>
            </div>

            <div className={styles.riverItemImage}>
              <Image
                src={essay.coverUrl}
                alt={essay.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
