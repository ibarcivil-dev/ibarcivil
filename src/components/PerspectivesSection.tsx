import React from 'react';
import Link from 'next/link';
import styles from '@/app/(public)/page.module.css';
import { Article, Author } from '@/lib/mockDb';

interface PerspectivesSectionProps {
  perspectives: Article[];
  authors: Author[];
}

export function PerspectivesSection({ perspectives, authors }: PerspectivesSectionProps) {
  const getAuthor = (id: string) => authors.find(a => a.id === id);

  if (perspectives.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Perspectives</h2>
      </div>

      <div className={styles.perspectivesGrid}>
        {perspectives.map(p => (
          <div key={p.id} className={styles.perspectiveItem}>
            <span className={styles.tag}>Perspective</span>
            <h3 className={styles.perspectiveTitle}>
              <Link href={`/article/${p.slug}`}>{p.title}</Link>
            </h3>
            <p className={styles.perspectiveExcerpt}>{p.excerpt}</p>
            <div className={styles.heroMeta}>
              <span>By <Link href={`/author/${getAuthor(p.authorId)?.slug}`} style={{ textDecoration: 'underline' }}>{getAuthor(p.authorId)?.name}</Link></span>
              <span>•</span>
              <span>{p.readingTime} min read</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
