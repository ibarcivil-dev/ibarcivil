"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/app/(public)/page.module.css';
import { Article, Author } from '@/lib/mockDb';

interface HeroSectionProps {
  articles: Article[];
  authors: Author[];
}

export function HeroSection({ articles, authors }: HeroSectionProps) {
  // Cloned list of slides for infinite transition: D, A, B, C, D, A
  const slides = articles.length > 0 
    ? [articles[articles.length - 1], ...articles, articles[0]]
    : [];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [transitioningActive, setTransitioningActive] = useState(false);

  const getAuthor = (id: string) => authors.find(a => a.id === id);

  const handlePrev = () => {
    if (transitioningActive) return;
    setTransitioningActive(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (transitioningActive) return;
    setTransitioningActive(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDotClick = (index: number) => {
    if (transitioningActive) return;
    setTransitioningActive(true);
    setCurrentIndex(index + 1);
  };

  const handleTransitionEnd = () => {
    setTransitioningActive(false);
    if (currentIndex === articles.length + 1) {
      // Jump from clone of A (index 5) instantly to real A (index 1)
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      // Jump from clone of D (index 0) instantly to real D (index 4)
      setIsTransitioning(false);
      setCurrentIndex(articles.length);
    }
  };

  // Re-enable transition after index jump completes in the next paint frame
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Autoplay loop setup
  useEffect(() => {
    const timer = setInterval(() => {
      if (!transitioningActive) {
        setTransitioningActive(true);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 7000); // 7s pause between slides
    return () => clearInterval(timer);
  }, [articles.length, currentIndex, transitioningActive]);

  if (!articles || articles.length === 0) return null;

  // Render dot highlighted state matching active essay slide index (1 to 4 maps to 0 to 3)
  const getActiveDotIndex = () => {
    if (currentIndex === 0) return articles.length - 1;
    if (currentIndex === articles.length + 1) return 0;
    return currentIndex - 1;
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.sliderWrapper}>
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className={`${styles.navArrow} ${styles.prevArrow}`}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className={`${styles.navArrow} ${styles.nextArrow}`}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Sliding Track */}
        <div
          className={styles.sliderTrack}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning 
              ? 'transform 3.2s cubic-bezier(0.25, 1, 0.5, 1)' 
              : 'none'
          }}
        >
          {slides.map((article, index) => {
            const author = getAuthor(article.authorId);
            return (
              <div key={`${article.id}-slide-${index}`} className={styles.slide}>
                <div className="container">
                  <div className={styles.heroGrid}>
                    <div className={styles.heroContent}>
                      <h1 className={styles.heroTitle}>
                        <Link href={`/article/${article.slug}`}>{article.title}</Link>
                      </h1>
                      <p className={styles.heroExcerpt}>{article.excerpt}</p>
                      <div className={styles.heroMeta}>
                        <span>
                          By{' '}
                          <Link
                            href={`/author/${author?.slug}`}
                            style={{ textDecoration: 'underline' }}
                          >
                            {author?.name}
                          </Link>
                        </span>
                        <span>•</span>
                        <span>{article.readingTime} min read</span>
                      </div>
                      <Link href={`/article/${article.slug}`} className={styles.readBtn}>
                        Read Article
                      </Link>
                    </div>
                    <Link href={`/article/${article.slug}`} className={styles.heroImageLink}>
                      <div className={styles.heroImageContainer}>
                        <Image
                          src={article.coverUrl}
                          alt={article.title}
                          fill
                          priority={index === 1}
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 900px) 100vw, 600px"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className={styles.navDots}>
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`${styles.navDot} ${
                index === getActiveDotIndex() ? styles.navDotActive : ''
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
