import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { HomepageNewsletter } from '@/components/HomepageNewsletter';
import {
  getHomepageConfig,
  getArticles,
  getAuthors,
  getIssues,
  getEditorNotes,
  getRecommendations,
} from '@/lib/mockDb';

export default async function Homepage() {
  const config = getHomepageConfig();
  const articles = getArticles();
  const authors = getAuthors();
  const issues = getIssues();
  const editorNotes = getEditorNotes();
  const recommendations = getRecommendations();

  // Find featured items
  const heroArticle = articles.find(a => a.id === config.heroArticleId);
  const featuredEssays = config.featuredEssayIds
    .map(id => articles.find(a => a.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a);
  const spotlightIssue = issues.find(i => i.id === config.issueSpotlightId);
  const archiveHighlight = articles.find(a => a.id === config.archiveHighlightId);
  const spotlightNote = editorNotes.find(n => n.id === config.editorsNoteId);

  // Helper to find author details
  const getAuthor = (id: string) => authors.find(a => a.id === id);

  // Filter perspectives
  const perspectives = articles.filter(a => a.isPerspective).slice(0, 2);

  // Fallback hero if not found
  const activeHero = heroArticle || articles[0];
  const heroAuthor = activeHero ? getAuthor(activeHero.authorId) : null;

  return (
    <div className="container">
      {/* 1. HERO STORY [Invitation] */}
      {activeHero && (
        <section className={styles.sectionLarge} style={{ borderBottom: '1px solid var(--border)' }}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <span className={styles.tag}>Hero Story</span>
              <h1 className={styles.heroTitle}>
                <Link href={`/article/${activeHero.slug}`}>{activeHero.title}</Link>
              </h1>
              <p className={styles.heroExcerpt}>{activeHero.excerpt}</p>
              <div className={styles.heroMeta}>
                <span>By {heroAuthor?.name}</span>
                <span>•</span>
                <span>{activeHero.readingTime} min read</span>
              </div>
              <Link href={`/article/${activeHero.slug}`} className={styles.readBtn}>
                Read Article
              </Link>
            </div>
            <div className={styles.heroImageContainer}>
              <Image
                src={activeHero.coverUrl}
                alt={activeHero.title}
                fill
                priority={true}
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 100vw, 600px"
              />
            </div>
          </div>
        </section>
      )}

      {/* 2. FEATURED ESSAYS [Discovery] */}
      {featuredEssays.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Essays</h2>
            <span className={styles.sectionSubtitle}>Long-Form Analysis</span>
          </div>

          <div className={styles.essaysLayout}>
            {/* First Featured Essay - Large format */}
            {featuredEssays[0] && (
              <div className={styles.essayLarge}>
                <div className={styles.essayImage}>
                  <Image
                    src={featuredEssays[0].coverUrl}
                    alt={featuredEssays[0].title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 550px"
                  />
                </div>
                <div className={styles.essayContent}>
                  <span className={styles.tag}>Essay</span>
                  <h3 className={styles.essayTitle}>
                    <Link href={`/article/${featuredEssays[0].slug}`}>{featuredEssays[0].title}</Link>
                  </h3>
                  <p className={styles.essayExcerpt}>{featuredEssays[0].excerpt}</p>
                  <div className={styles.heroMeta}>
                    <span>By {getAuthor(featuredEssays[0].authorId)?.name}</span>
                    <span>•</span>
                    <span>{featuredEssays[0].readingTime} min read</span>
                  </div>
                </div>
              </div>
            )}

            {/* Second/Third Featured Essays - Grid layout */}
            {featuredEssays.length > 1 && (
              <div className={styles.essayMedium}>
                {featuredEssays.slice(1, 3).map(essay => (
                  <div key={essay.id} className={styles.essayContent} style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                    <span className={styles.tag}>Essay</span>
                    <h3 className={styles.essayTitle} style={{ fontSize: '1.75rem' }}>
                      <Link href={`/article/${essay.slug}`}>{essay.title}</Link>
                    </h3>
                    <p className={styles.essayExcerpt} style={{ fontSize: '0.95rem' }}>{essay.excerpt}</p>
                    <div className={styles.heroMeta}>
                      <span>By {getAuthor(essay.authorId)?.name}</span>
                      <span>•</span>
                      <span>{essay.readingTime} min read</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. ISSUE SPOTLIGHT [Context] */}
      {spotlightIssue && (
        <section className={styles.sectionLarge}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Issue Spotlight</h2>
            <span className={styles.sectionSubtitle}>Current Print Edition</span>
          </div>

          <div className={styles.issueGrid}>
            <div className={styles.issueCover}>
              <Image
                src={spotlightIssue.coverUrl}
                alt={spotlightIssue.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 100vw, 380px"
              />
            </div>
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
      )}

      {/* 4. EDITOR'S NOTEBOOK [Invitation] */}
      {spotlightNote && (
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
      )}

      {/* 5. PERSPECTIVES [Debate] */}
      {perspectives.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Perspectives</h2>
            <span className={styles.sectionSubtitle}>Arguments & Viewpoints</span>
          </div>

          <div className={styles.perspectivesGrid}>
            {perspectives.map(p => (
              <div key={p.id} className={styles.perspectiveItem}>
                <span className={styles.tag}>Perspective</span>
                <h3 className={styles.perspectiveTitle}>
                  <Link href={`/article/${p.slug}`}>{p.title}</Link>
                </h3>
                <p className={styles.perspectiveExcerpt}>{p.excerpt}</p>
                <div className={styles.heroMeta}>
                  <span>By {getAuthor(p.authorId)?.name}</span>
                  <span>•</span>
                  <span>{p.readingTime} min read</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. ARCHIVE HIGHLIGHT [Rediscovery] */}
      {archiveHighlight && (
        <section className={styles.sectionLarge}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>From the Archives</h2>
            <span className={styles.sectionSubtitle}>Timeless Writing</span>
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
                <span>By {getAuthor(archiveHighlight.authorId)?.name}</span>
                <span>•</span>
                <span>{archiveHighlight.readingTime} min read</span>
              </div>
              <Link href={`/article/${archiveHighlight.slug}`} className={styles.readBtn}>
                Read Essay
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
      )}

      {/* 7. READING LIST [Curated recommendation] */}
      {recommendations.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Reading List</h2>
            <span className={styles.sectionSubtitle}>Curated Choices</span>
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
      )}

      {/* 8. CONTRIBUTORS [Connection] */}
      <section className={styles.sectionLarge}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Contributors</h2>
          <span className={styles.sectionSubtitle}>Writers & Scholars</span>
        </div>

        <div className={styles.contributorsGrid}>
          {authors.map(author => (
            <div key={author.id} className={styles.contributorCard}>
              <div className={styles.avatarContainer}>
                {/* Simulated Avatars using placeholder styling as image generator runs later */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'var(--accent)',
                  opacity: 0.15,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  color: 'var(--text-primary)'
                }}>
                  {author.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className={styles.contributorName}>
                  <Link href={`/author/${author.slug}`}>{author.name}</Link>
                </h3>
                <span className={styles.contributorSpec}>{author.specialization}</span>
              </div>
              <div className={styles.contributorInterests}>
                <span style={{ fontWeight: '600', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Current Interest:
                </span>
                {author.currentInterests[0]}
              </div>
              <Link href={`/author/${author.slug}`} style={{ fontSize: '0.85rem', textDecoration: 'underline' }}>
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER */}
      <HomepageNewsletter />
    </div>
  );
}
