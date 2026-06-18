import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/(public)/page.module.css';
import { Issue, Article, Author } from '@/lib/mockDb';

interface IssueSpotlightProps {
  spotlightIssue: Issue;
  articles: Article[];
  authors: Author[];
}

export function IssueSpotlight({ spotlightIssue, articles, authors }: IssueSpotlightProps) {
  const getAuthor = (id: string) => authors.find(a => a.id === id);

  return (
    <section className={styles.sectionLarge}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Issue Spotlight</h2>
        <span className={styles.sectionSubtitle}>Current Print Edition</span>
      </div>

      <div className={styles.issueGrid}>
        <Link href={`/issue/${spotlightIssue.id}`} className={styles.issueCoverLink}>
          <div className={styles.issueCover}>
            <Image
              src={spotlightIssue.coverUrl}
              alt={spotlightIssue.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 900px) 100vw, 380px"
            />
          </div>
        </Link>
        <div className={styles.issueDetails}>
          <div>
            <span className={styles.issueNum}>Issue No. {spotlightIssue.number}</span>
            <h3 className={styles.issueTitle}>
              <Link href={`/issue/${spotlightIssue.id}`}>{spotlightIssue.title}</Link>
            </h3>
            <p className={styles.issueDesc}>{spotlightIssue.description}</p>
          </div>

          <div>
            <h4 className={styles.sectionSubtitle} style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>
              Selected Contents
            </h4>
            <div className={styles.issueArticlesList}>
              {articles
                .filter(a => a.issueId === spotlightIssue.id)
                .slice(0, 3)
                .map(article => (
                  <Link
                    href={`/article/${article.slug}`}
                    key={article.id}
                    className={styles.issueArticleRow}
                  >
                    <span className={styles.issueArticleTitle}>{article.title}</span>
                    <span className={styles.heroMeta} style={{ fontSize: '0.8rem' }}>
                      {getAuthor(article.authorId)?.name}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
          
          <Link href={`/issue/${spotlightIssue.id}`} className={styles.readBtn}>
            Explore Full Issue
          </Link>
        </div>
      </div>
    </section>
  );
}
