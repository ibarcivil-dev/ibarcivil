import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './FeaturedEssays.module.css';
import { Article } from '@/lib/mockDb';

interface ListCardProps {
  article: Article;
  authorName?: string;
  variant?: 'excerpt' | 'thumb-only' | 'muted' | 'spotlight';
}

export function ListCard({ article, authorName, variant = 'excerpt' }: ListCardProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'thumb-only':
        return styles.rowThumbOnly;
      case 'muted':
        return styles.rowMuted;
      case 'spotlight':
        return styles.rowSpotlight;
      case 'excerpt':
      default:
        return styles.rowWithExcerpt;
    }
  };

  const hasThumbnail = variant === 'excerpt' || variant === 'thumb-only';
  const showExcerpt = variant === 'excerpt' || variant === 'muted';
  const showPullQuote = variant === 'spotlight';

  return (
    <Link href={`/article/${article.slug}`} className={`${styles.stackRow} ${getVariantClass()}`}>
      {hasThumbnail && article.coverUrl && (
        <div className={styles.rowThumb}>
          <Image
            src={article.coverUrl}
            alt={article.title}
            fill
            sizes="140px"
            className={styles.thumbImage}
          />
        </div>
      )}
      <div className={styles.rowBody}>
        <h4 className={styles.rowTitle}>{article.title}</h4>
        
        {showExcerpt && article.excerpt && (
          <p className={styles.rowExcerpt}>{article.excerpt}</p>
        )}
        
        {showPullQuote && article.excerpt && (
          <blockquote className={styles.pullQuote}>
            {article.excerpt.slice(0, 120)}…
          </blockquote>
        )}
        
        <div className={styles.meta}>
          {authorName && (
            <>
              <span>By {authorName}</span>
              <span>•</span>
            </>
          )}
          <span>{article.readingTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
