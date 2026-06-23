import React from 'react';
import styles from './FeaturedEssays.module.css';
import { Article, Author } from '@/lib/mockDb';
import { HeroCard } from './HeroCard';
import { ListCard } from './ListCard';

interface FeaturedEssaysProps {
  featuredEssays: Article[];
  authors: Author[];
}

export function FeaturedEssays({ featuredEssays, authors }: FeaturedEssaysProps) {
  const getAuthor = (id: string) => authors.find(a => a.id === id);

  if (featuredEssays.length === 0) return null;

  const essay1 = featuredEssays[0];  // pinnedHero
  const essay2 = featuredEssays[1];  // rowWithExcerpt
  const essay3 = featuredEssays[2];  // rowThumbOnly
  const essay4 = featuredEssays[3];  // rowMuted
  const essay5 = featuredEssays[4];  // rowSpotlight

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Featured</h2>
      </div>

      <div className={styles.essaysGrid}>
        {essay1 && (
          <HeroCard
            article={essay1}
            authorName={getAuthor(essay1.authorId)?.name}
          />
        )}

        <div className={styles.stackRows}>
          {essay2 && (
            <ListCard
              article={essay2}
              authorName={getAuthor(essay2.authorId)?.name}
              variant="excerpt"
            />
          )}

          {essay3 && (
            <ListCard
              article={essay3}
              authorName={getAuthor(essay3.authorId)?.name}
              variant="thumb-only"
            />
          )}

          {essay4 && (
            <ListCard
              article={essay4}
              authorName={getAuthor(essay4.authorId)?.name}
              variant="muted"
            />
          )}

          {essay5 && (
            <ListCard
              article={essay5}
              authorName={getAuthor(essay5.authorId)?.name}
              variant="spotlight"
            />
          )}
        </div>
      </div>
    </section>
  );
}
