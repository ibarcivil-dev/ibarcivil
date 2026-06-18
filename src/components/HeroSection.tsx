import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/(public)/page.module.css';
import { Article, Author } from '@/lib/mockDb';

interface HeroSectionProps {
  activeHero: Article;
  heroAuthor: Author | null | undefined;
}

export function HeroSection({ activeHero, heroAuthor }: HeroSectionProps) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <Link href={`/article/${activeHero.slug}`}>{activeHero.title}</Link>
          </h1>
          <p className={styles.heroExcerpt}>{activeHero.excerpt}</p>
          <div className={styles.heroMeta}>
            <span>By <Link href={`/author/${heroAuthor?.slug}`} style={{ textDecoration: 'underline' }}>{heroAuthor?.name}</Link></span>
            <span>•</span>
            <span>{activeHero.readingTime} min read</span>
          </div>
          <Link href={`/article/${activeHero.slug}`} className={styles.readBtn}>
            Read
          </Link>
        </div>
        <Link href={`/article/${activeHero.slug}`} className={styles.heroImageLink}>
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
        </Link>
      </div>
    </section>
  );
}
