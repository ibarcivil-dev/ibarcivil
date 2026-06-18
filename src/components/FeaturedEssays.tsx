import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './FeaturedEssays.module.css';
import { Article, Author } from '@/lib/mockDb';

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
        <h2 className={styles.sectionTitle}>Featured Essays</h2>
        <span className={styles.sectionSubtitle}>Long-Form Analysis</span>
      </div>

      {/* Desktop */}
      <div className={styles.desktopLayout}>
        {essay1 && (
          <Link href={`/article/${essay1.slug}`} className={styles.pinnedHero}>
            {essay1.coverUrl && (
              <Image
                src={essay1.coverUrl}
                alt={essay1.title}
                fill
                sizes="440px"
                className={styles.pinnedImage}
                priority
              />
            )}
            <div className={styles.pinnedOverlay} />
            <div className={styles.pinnedCaption}>
              <h3 className={styles.pinnedTitle}>{essay1.title}</h3>
              <div className={styles.meta}>
                <span>By {getAuthor(essay1.authorId)?.name}</span>
                <span>•</span>
                <span>{essay1.readingTime} min read</span>
              </div>
            </div>
          </Link>
        )}

        <div className={styles.stackRows}>
          {essay2 && (
            <Link href={`/article/${essay2.slug}`} className={`${styles.stackRow} ${styles.rowWithExcerpt}`}>
              <div className={styles.rowThumb}>
                {essay2.coverUrl && (
                  <Image
                    src={essay2.coverUrl}
                    alt={essay2.title}
                    fill
                    sizes="88px"
                    className={styles.thumbImage}
                  />
                )}
              </div>
              <div className={styles.rowBody}>
                <h4 className={styles.rowTitle}>{essay2.title}</h4>
                <p className={styles.rowExcerpt}>{essay2.excerpt}</p>
                <div className={styles.meta}>
                  <span>By {getAuthor(essay2.authorId)?.name}</span>
                  <span>•</span>
                  <span>{essay2.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}

          {essay3 && (
            <Link href={`/article/${essay3.slug}`} className={`${styles.stackRow} ${styles.rowThumbOnly}`}>
              <div className={styles.rowThumb}>
                {essay3.coverUrl && (
                  <Image
                    src={essay3.coverUrl}
                    alt={essay3.title}
                    fill
                    sizes="88px"
                    className={styles.thumbImage}
                  />
                )}
              </div>
              <div className={styles.rowBody}>
                <h4 className={styles.rowTitle}>{essay3.title}</h4>
                <div className={styles.meta}>
                  <span>By {getAuthor(essay3.authorId)?.name}</span>
                  <span>•</span>
                  <span>{essay3.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}

          {essay4 && (
            <Link href={`/article/${essay4.slug}`} className={`${styles.stackRow} ${styles.rowMuted}`}>
              <div className={styles.rowBody}>
                <h4 className={styles.rowTitle}>{essay4.title}</h4>
                <p className={styles.rowExcerpt}>{essay4.excerpt}</p>
                <div className={styles.meta}>
                  <span>By {getAuthor(essay4.authorId)?.name}</span>
                  <span>•</span>
                  <span>{essay4.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}

          {essay5 && (
            <Link href={`/article/${essay5.slug}`} className={`${styles.stackRow} ${styles.rowSpotlight}`}>
              <div className={styles.rowBody}>
                <h4 className={styles.rowTitle}>{essay5.title}</h4>
                <blockquote className={styles.pullQuote}>
                  {essay5.excerpt?.slice(0, 120)}…
                </blockquote>
                <div className={styles.meta}>
                  <span>By {getAuthor(essay5.authorId)?.name}</span>
                  <span>•</span>
                  <span>{essay5.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className={styles.mobileLayout}>
        {essay1 && (
          <Link href={`/article/${essay1.slug}`} className={styles.mobileHero}>
            {essay1.coverUrl && (
              <Image
                src={essay1.coverUrl}
                alt={essay1.title}
                fill
                sizes="100vw"
                className={styles.pinnedImage}
                priority
              />
            )}
            <div className={styles.pinnedOverlay} />
            <div className={styles.pinnedCaption}>
              <h3 className={styles.pinnedTitle}>{essay1.title}</h3>
              <div className={styles.meta}>
                <span>By {getAuthor(essay1.authorId)?.name}</span>
                <span>•</span>
                <span>{essay1.readingTime} min read</span>
              </div>
            </div>
          </Link>
        )}

        <div className={styles.mobileRows}>
          {essay2 && (
            <Link href={`/article/${essay2.slug}`} className={`${styles.stackRow} ${styles.rowWithExcerpt}`}>
              <div className={styles.rowThumb}>
                {essay2.coverUrl && (
                  <Image
                    src={essay2.coverUrl}
                    alt={essay2.title}
                    fill
                    sizes="88px"
                    className={styles.thumbImage}
                  />
                )}
              </div>
              <div className={styles.rowBody}>
                <h4 className={styles.rowTitle}>{essay2.title}</h4>
                <p className={styles.rowExcerpt}>{essay2.excerpt}</p>
                <div className={styles.meta}>
                  <span>By {getAuthor(essay2.authorId)?.name}</span>
                  <span>•</span>
                  <span>{essay2.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}

          {essay3 && (
            <Link href={`/article/${essay3.slug}`} className={`${styles.stackRow} ${styles.rowThumbOnly}`}>
              <div className={styles.rowThumb}>
                {essay3.coverUrl && (
                  <Image
                    src={essay3.coverUrl}
                    alt={essay3.title}
                    fill
                    sizes="88px"
                    className={styles.thumbImage}
                  />
                )}
              </div>
              <div className={styles.rowBody}>
                <h4 className={styles.rowTitle}>{essay3.title}</h4>
                <div className={styles.meta}>
                  <span>By {getAuthor(essay3.authorId)?.name}</span>
                  <span>•</span>
                  <span>{essay3.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}

          {essay4 && (
            <Link href={`/article/${essay4.slug}`} className={`${styles.stackRow} ${styles.rowMuted}`}>
              <div className={styles.rowBody}>
                <h4 className={styles.rowTitle}>{essay4.title}</h4>
                <p className={styles.rowExcerpt}>{essay4.excerpt}</p>
                <div className={styles.meta}>
                  <span>By {getAuthor(essay4.authorId)?.name}</span>
                  <span>•</span>
                  <span>{essay4.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}

          {essay5 && (
            <Link href={`/article/${essay5.slug}`} className={`${styles.stackRow} ${styles.rowSpotlight}`}>
              <div className={styles.rowBody}>
                <h4 className={styles.rowTitle}>{essay5.title}</h4>
                <blockquote className={styles.pullQuote}>
                  {essay5.excerpt?.slice(0, 120)}…
                </blockquote>
                <div className={styles.meta}>
                  <span>By {getAuthor(essay5.authorId)?.name}</span>
                  <span>•</span>
                  <span>{essay5.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
