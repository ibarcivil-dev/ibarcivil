import React from 'react';
import Link from 'next/link';
import styles from '@/app/(public)/page.module.css';
import { Article, Issue, Author } from '@/lib/mockDb';

interface ArchiveHighlightProps {
  archiveHighlight: Article;
  issues: Issue[];
  authors: Author[];
}

export function ArchiveHighlight({ archiveHighlight, issues, authors }: ArchiveHighlightProps) {
  const getAuthor = (id: string) => authors.find(a => a.id === id);

  return (
    <section className={styles.sectionLarge}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>From the Archives</h2>
      </div>

      <div className={styles.archiveHighlight}>
        <div className={styles.essayContent}>
          <span className={styles.tag} style={{ color: 'var(--text-secondary)' }}>
            Archived Issue No. {issues.find(i => i.id === archiveHighlight.issueId)?.number || 11}
          </span>
          <h3 className={styles.essayTitle} style={{ fontSize: '2.5rem' }}>
            <Link href={`/article/${archiveHighlight.slug}`}>{archiveHighlight.title}</Link>
          </h3>
          <p className={styles.essayExcerpt}>{archiveHighlight.excerpt}</p>
          <div className={styles.heroMeta}>
            <span>By <Link href={`/author/${getAuthor(archiveHighlight.authorId)?.slug}`} style={{ textDecoration: 'underline' }}>{getAuthor(archiveHighlight.authorId)?.name}</Link></span>
            <span>•</span>
            <span>{archiveHighlight.readingTime} min read</span>
          </div>
          <Link href={`/article/${archiveHighlight.slug}`} className={styles.readBtn}>
            Read
          </Link>
        </div>
        
        <div className={styles.archiveCommentary}>
          <h4 className={styles.archiveCommentaryTitle}>Why It Matters Now</h4>
          <p className={styles.archiveCommentaryText}>
            &ldquo;In this classic piece, Elena Rostova predicted the current crisis of attention by detailing the physical layout of airports. It remains a blueprint for reclaiming cognitive silence in an age designed to sell every split-second gap.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
