import React from 'react';
import Link from 'next/link';
import styles from '@/app/(public)/page.module.css';
import { EditorNote } from '@/lib/mockDb';

interface EditorsNotebookProps {
  editorNotes: EditorNote[];
  spotlightNote: EditorNote | null | undefined;
}

export function EditorsNotebook({ editorNotes, spotlightNote }: EditorsNotebookProps) {
  if (!spotlightNote) return null;

  return (
    <section className={styles.section} style={{ padding: '0', borderBottom: 'none' }}>
      <div className={styles.notebookBg}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className={styles.sectionHeader} style={{ borderColor: 'var(--text-primary)' }}>
            <h2 className={styles.sectionTitle}>Editor&rsquo;s Notebook</h2>
            <span className={styles.sectionSubtitle}>Observations & Fragments</span>
          </div>
          <div className={styles.notebookGrid}>
            {editorNotes.slice(0, 2).map(note => (
              <div key={note.id} className={styles.noteCard}>
                <span className={styles.noteMeta}>
                  Notebook • {new Date(note.publishedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <h3 className={styles.noteTitle}>{note.title}</h3>
                <p className={styles.noteText}>{note.content.substring(0, 220)}...</p>
                <Link href={`/about#notebook`} className={styles.readBtn} style={{ fontSize: '0.8rem' }}>
                  Read Notes
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
