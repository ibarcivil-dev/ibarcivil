import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { getPerspectives, getAuthors } from '@/lib/mockDb';

export const metadata = {
  title: 'Perspectives',
  description: 'Active arguments, cultural critiques, and opinion pieces focusing on politics, society, and epistemology.',
};

export default async function PerspectivesPage() {
  const perspectives = getPerspectives();
  const authors = getAuthors();

  const getAuthor = (id: string) => authors.find(a => a.id === id);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Perspectives</h1>

      <div className={styles.grid}>
        {perspectives.map(p => {
          const author = getAuthor(p.authorId);
          
          // Get a pullquote from content for preview (lines starting with '>')
          const matchQuote = p.content.match(/^>\s+"?([^"\n]+)"?/m);
          const pullquote = matchQuote ? matchQuote[1] : p.excerpt;

          return (
            <div key={p.id} className={styles.perspectiveRow}>
              <div className={styles.content}>
                <span className={styles.tag}>Perspective</span>
                <h2 className={styles.itemTitle}>
                  <Link href={`/article/${p.slug}`}>{p.title}</Link>
                </h2>
                <p className={styles.excerpt}>{p.excerpt}</p>
                <div className={styles.meta}>
                  <span>
                    By{' '}
                    <Link href={`/author/${author?.slug}`} className={styles.metaLink}>
                      {author?.name}
                    </Link>
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(p.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span>{p.readingTime} min read</span>
                </div>
              </div>

              <div className={styles.quoteBlock}>
                <p className={styles.quoteText}>&ldquo;{pullquote.substring(0, 100)}...&rdquo;</p>
                <span className={styles.quoteAuthor}>— {author?.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
