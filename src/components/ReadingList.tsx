import React from 'react';
import styles from '@/app/(public)/page.module.css';
import { Recommendation } from '@/lib/mockDb';

interface ReadingListProps {
  recommendations: Recommendation[];
}

export function ReadingList({ recommendations }: ReadingListProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Reading List</h2>
      </div>

      <div className={styles.readingGrid}>
        {recommendations.map(rec => (
          <div key={rec.id} className={styles.readingItem}>
            <h3 className={styles.readingTitle}>
              <a href={rec.url}>{rec.title}</a>
            </h3>
            <span className={styles.readingCurator}>Recommended by {rec.curatorName}</span>
            <p className={styles.readingCommentary}>{rec.commentary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
