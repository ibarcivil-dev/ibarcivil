import React from 'react';
import { HomepageNewsletter } from '@/components/HomepageNewsletter';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedEssays } from '@/components/FeaturedEssays';
import { IssueSpotlight } from '@/components/IssueSpotlight';
import { EditorsNotebook } from '@/components/EditorsNotebook';
import { PerspectivesSection } from '@/components/PerspectivesSection';
import { ArchiveHighlight } from '@/components/ArchiveHighlight';
import { ReadingList } from '@/components/ReadingList';
import { ContributorsSection } from '@/components/ContributorsSection';
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

  // Hero slides setup: main hero article plus 3 other essays
  const primaryHero = heroArticle || articles[0];
  const otherArticles = articles.filter(a => a.id !== primaryHero?.id);
  const heroArticles = primaryHero ? [primaryHero, ...otherArticles.slice(0, 3)] : articles.slice(0, 4);

  return (
    <>
      {/* 1. HERO STORY [Invitation] */}
      {heroArticles.length > 0 && (
        <HeroSection articles={heroArticles} authors={authors} />
      )}

      <div className="container">

      {/* 2. FEATURED ESSAYS [Discovery] */}
      <FeaturedEssays featuredEssays={featuredEssays} authors={authors} />

      {/* 3. ISSUE SPOTLIGHT [Context] */}
      {spotlightIssue && (
        <IssueSpotlight
          spotlightIssue={spotlightIssue}
          articles={articles}
          authors={authors}
        />
      )}

      {/* 4. EDITOR'S NOTEBOOK [Invitation] */}
      <EditorsNotebook editorNotes={editorNotes} spotlightNote={spotlightNote} />

      {/* 5. PERSPECTIVES [Debate] */}
      <PerspectivesSection perspectives={perspectives} authors={authors} />

      {/* 6. ARCHIVE HIGHLIGHT [Rediscovery] */}
      {archiveHighlight && (
        <ArchiveHighlight
          archiveHighlight={archiveHighlight}
          issues={issues}
          authors={authors}
        />
      )}

      {/* 7. READING LIST [Curated recommendation] */}
      <ReadingList recommendations={recommendations} />

      {/* 8. CONTRIBUTORS [Connection] */}
      <ContributorsSection authors={authors} />

      {/* 9. NEWSLETTER */}
      <HomepageNewsletter />
    </div>
  </>
  );
}
