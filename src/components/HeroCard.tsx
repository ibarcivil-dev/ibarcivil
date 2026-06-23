import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './FeaturedEssays.module.css';
import { Article } from '@/lib/mockDb';

interface HeroCardProps {
  article: Article;
  authorName?: string;
}

export function HeroCard({ article, authorName }: HeroCardProps) {
  return (
    <Link href={`/article/${article.slug}`} className={styles.featuredHero}>
      {article.coverUrl && (
        <Image
          src={article.coverUrl}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 520px"
          className={styles.pinnedImage}
          priority
        />
      )}
      <div className={styles.pinnedOverlay} />
      <div className={styles.pinnedCaption}>
        <h3 className={styles.pinnedTitle}>{article.title}</h3>
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
