import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './ArticlePage.module.css';
import { Markdown } from '@/components/Markdown';
import { ArticleClientEffects } from './ArticleClientEffects';
import { InlineNewsletterForm } from '@/components/InlineNewsletterForm';
import {
  getArticles,
  getArticleBySlug,
  getAuthorBySlug,
  getArticlesByTopic,
  getTopicBySlug,
  getIssueById,
  getAuthors,
} from '@/lib/mockDb';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      images: [
        {
          url: article.coverUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.coverUrl],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const authors = getAuthors();
  const author = authors.find(a => a.id === article.authorId);
  const topic = article.topicId ? getTopicBySlug(article.topicId) : null;
  const issue = article.issueId ? getIssueById(article.issueId) : null;

  // Extract H3 headings dynamically for TOC
  const headings = article.content
    .match(/^###\s+(.+)$/gm)
    ?.map(h => h.replace(/^###\s+/, '').trim()) || [];

  // Get related reading (articles from same topic, excluding current)
  let relatedArticles = article.topicId
    ? getArticlesByTopic(article.topicId)
        .filter(a => a.id !== article.id)
    : [];

  // Fallback: If no articles in the same topic, get recent articles excluding the current one
  if (relatedArticles.length === 0) {
    relatedArticles = getArticles()
      .filter(a => a.id !== article.id);
  }

  relatedArticles = relatedArticles.slice(0, 2);

  const isTitleUrdu = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(article.title + ' ' + article.subtitle);

  return (
    <article className={styles.articleWrapper}>
      {/* 1. ARTICLE TITLE & META [Immersion] */}
      <div className={`${styles.header} ${isTitleUrdu ? 'ur urdu' : ''}`} lang={isTitleUrdu ? 'ur' : 'en'} dir={isTitleUrdu ? 'rtl' : 'ltr'}>
        {topic && (
          <Link href={`/topic/${topic.slug}`} className={styles.topic}>
            {topic.name}
          </Link>
        )}
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.subtitle}>{article.subtitle}</p>

        <div className={styles.meta} dir="ltr">
          <span>
            By{' '}
            <Link href={`/author/${author?.slug}`} className={styles.metaLink}>
              {author?.name}
            </Link>
          </span>
          <span>•</span>
          <span>
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          {issue && (
            <>
              <span>•</span>
              <span>
                In{' '}
                <Link href={`/issue/${issue.id}`} className={styles.metaLink}>
                  Issue No. {issue.number}
                </Link>
              </span>
            </>
          )}
          <span>•</span>
          <span>{article.readingTime} min read</span>
        </div>
      </div>

      {/* 2. COVER IMAGE */}
      <div className={styles.coverContainer}>
        <Image
          src={article.coverUrl}
          alt={article.title}
          fill
          priority={true}
          style={{ objectFit: 'cover' }}
          sizes="100vw"
        />
      </div>

      {/* 3. TABLE OF CONTENTS (for long articles) */}
      {headings.length > 0 && (
        <div className={styles.tocContainer}>
          <h4 className={styles.tocTitle}>Table of Contents</h4>
          <ul className={styles.tocList}>
            {headings.map((heading, i) => (
              <li key={i}>
                <a href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className={styles.tocLink}>
                  {heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. ARTICLE BODY (Markdown Renderer) */}
      {/* Set up section IDs for TOC targeting in custom Markdown component */}
      <Markdown
        content={article.content.replace(/^###\s+(.+)$/gm, (match, heading) => {
          const id = heading.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
          return `<a id="${id}"></a>\n### ${heading}`;
        })}
      />

      {/* 5. FOOTNOTES */}
      <section className={styles.footnotes} aria-label="Footnotes">
        <h4 className={styles.footnotesTitle}>Footnotes</h4>
        <ol className={styles.footnotesList}>
          <li>
            Polanyi, Michael. *The Tacit Dimension*. Doubleday & Co, 1966. Polanyi defines tacit knowledge as that which cannot be easily transferred through verbal or written instruction alone, but must be demonstrated.
          </li>
          <li>
            Bachelard, Gaston. *The Poetics of Space*. Beacon Press, 1994. An exploration of the house and spatial coordinates as places of daydreaming and security.
          </li>
          <li>
            Carr, Nicholas. *The Shallows: What the Internet Is Doing to Our Brains*. W. W. Norton & Company, 2010. Detailing cognitive re-routing under digital hypertext environments.
          </li>
        </ol>
      </section>

      {/* 6. CLIENT ACTIONS (Scroll Progress & Social Sharing) */}
      <ArticleClientEffects />

      {/* 7. RELATED READING [Discovery] */}
      {relatedArticles.length > 0 && (
        <section className={styles.relatedSection}>
          <h3 className={styles.relatedTitle}>Related Reading</h3>
          <div className={styles.relatedGrid}>
            {relatedArticles.map(related => {
              const relatedTopic = related.topicId ? getTopicBySlug(related.topicId) : null;
              return (
                <Link key={related.id} href={`/article/${related.slug}`} className={styles.relatedCard}>
                  {related.coverUrl && (
                    <div className={styles.relatedImageContainer}>
                      <Image
                        src={related.coverUrl}
                        alt={related.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className={styles.relatedCardContent}>
                    {relatedTopic && (
                      <span className={styles.topic}>{relatedTopic.name}</span>
                    )}
                    <h4 className={styles.relatedCardTitle}>{related.title}</h4>
                    <p className={styles.relatedCardExcerpt}>{related.excerpt}</p>
                    <div className={styles.meta} style={{ borderWidth: '0', padding: '0', justifyContent: 'flex-start' }}>
                      <span>By {authors.find(a => a.id === related.authorId)?.name}</span>
                      <span>•</span>
                      <span>{related.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 8. INLINE NEWSLETTER */}
      <div className={styles.inlineNewsletter}>
        <h4 className={styles.inlineNewsletterTitle}>The Thinker&rsquo;s River</h4>
        <p className={styles.inlineNewsletterDesc}>
          If you valued this reading experience, join our email circle. We publish high-quality essays, opinions, and observations with absolute respect for your space.
        </p>
        <InlineNewsletterForm />
      </div>
    </article>
  );
}
