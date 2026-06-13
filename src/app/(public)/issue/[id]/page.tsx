import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './IssuePage.module.css';
import { Markdown } from '@/components/Markdown';
import { getIssueById, getArticlesByIssue, getAuthors, getTopicBySlug } from '@/lib/mockDb';

interface IssueProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: IssueProps) {
  const resolvedParams = await params;
  const issue = getIssueById(resolvedParams.id);

  if (!issue) {
    return {
      title: 'Issue Not Found',
    };
  }

  return {
    title: `Issue No. ${issue.number}: ${issue.title}`,
    description: issue.description,
  };
}

export default async function IssuePage({ params }: IssueProps) {
  const resolvedParams = await params;
  const issue = getIssueById(resolvedParams.id);

  if (!issue) {
    notFound();
  }

  const articles = getArticlesByIssue(issue.id);
  const authors = getAuthors();

  const getAuthor = (id: string) => authors.find(a => a.id === id);

  return (
    <div className={styles.container}>
      {/* 1. ISSUE HEADER [Context] */}
      <div className={styles.issueHeader}>
        <div className={styles.coverContainer}>
          <Image
            src={issue.coverUrl}
            alt={issue.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 900px) 100vw, 380px"
          />
        </div>

        <div className={styles.issueMeta}>
          <span className={styles.number}>Issue No. {issue.number}</span>
          <h1 className={styles.title}>{issue.title}</h1>
          <p className={styles.theme}>Theme: {issue.theme}</p>
        </div>
      </div>

      {/* 2. EDITOR LETTER [Invitation] */}
      <section className={styles.editorLetterSection}>
        <h2 className={styles.editorLetterTitle}>Letter from the Editor</h2>
        <div className={styles.editorLetterContent}>
          {/* We format paragraphs since editor note in mockDb has linebreaks */}
          {issue.editorNote.split('\n\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '20px' }}>
              {paragraph.trim()}
            </p>
          ))}
          <div className={styles.editorSignature}>
            — The Editorial Board, IBAR
          </div>
        </div>
      </section>

      {/* 3. TABLE OF CONTENTS [Discovery] */}
      <section className={styles.contentsSection}>
        <h2 className={styles.contentsTitle}>Table of Contents</h2>

        {articles.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>
            No essays listed in this issue.
          </p>
        ) : (
          <div className={styles.contentsList}>
            {articles.map(art => {
              const author = getAuthor(art.authorId);
              return (
                <div key={art.id} className={styles.contentRow}>
                  <div>
                    <h3 className={styles.artTitle}>
                      <Link href={`/article/${art.slug}`}>{art.title}</Link>
                    </h3>
                    <p className={styles.artExcerpt}>{art.excerpt}</p>
                  </div>
                  <div className={styles.artMeta}>
                    <span>By {author?.name}</span>
                    <br />
                    <span>{art.readingTime} min read</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
