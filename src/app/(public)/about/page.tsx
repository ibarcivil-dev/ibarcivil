import React from 'react';
import Link from 'next/link';
import styles from './AboutPage.module.css';
import { getEditorNotes, getAuthors } from '@/lib/mockDb';

export const metadata = {
  title: 'About & Manifesto',
  description: 'IBAR is a digital publication dedicated to deep essays, culture, philosophy, science, and the art of reading slowly.',
};

export default async function AboutPage() {
  const notes = getEditorNotes();
  const authors = getAuthors();

  return (
    <div className={styles.container}>
      {/* 1. MANIFESTO SECTION [Trust] */}
      <section className={styles.manifestoSection}>
        <h1 className={styles.title}>The IBAR Manifesto</h1>
        <p className={styles.manifestoText}>
          &ldquo;We build for readers who value depth over speed. We do not write for clicks, nor do we optimize for metrics. Every article we publish is an invitation to sit with an idea, to follow a line of thought to its logical end, and to embrace the friction of learning.&rdquo;
        </p>
      </section>

      {/* 2. THE EDITORIAL BOARD [Connection] */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Editorial Board</h2>
        <div className={styles.boardGrid}>
          {authors.map(author => (
            <div key={author.id} className={styles.boardMember}>
              <span className={styles.memberName}>
                <Link href={`/author/${author.slug}`}>{author.name}</Link>
              </span>
              <span className={styles.memberRole}>Contributor • {author.specialization}</span>
              <p className={styles.memberBio}>
                {author.bio.substring(0, 140)}...
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EDITOR'S NOTEBOOK [Invitation] */}
      <section className={styles.section} id="notebook">
        <h2 className={styles.sectionTitle}>Editor&rsquo;s Notebook</h2>
        <div className={styles.notebookRiver}>
          {notes.map(note => (
            <article key={note.id} className={styles.noteBlock}>
              <span className={styles.noteMeta}>
                Published on{' '}
                {new Date(note.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <h3 className={styles.noteTitle}>{note.title}</h3>
              <div className={styles.noteContent}>
                {/* Renders line breaks properly */}
                {note.content.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '16px' }}>
                    {para.trim()}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
