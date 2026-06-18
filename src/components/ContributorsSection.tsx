"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/(public)/page.module.css';
import { Author } from '@/lib/mockDb';

interface ContributorsSectionProps {
  authors: Author[];
}

export function ContributorsSection({ authors }: ContributorsSectionProps) {
  // Multiply the authors array to ensure there's enough runway to prevent blank space
  const baseList = React.useMemo(() => {
    let list = [...authors];
    while (list.length < 15) {
      list = [...list, ...authors];
    }
    return list;
  }, [authors]);

  const [displayList, setDisplayList] = useState<Author[]>([]);
  const [offsetX, setOffsetX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(240);
  const gap = 32;

  // Initialize display list
  useEffect(() => {
    setDisplayList(baseList);
  }, [baseList]);

  // Calculate dynamic card sizes to fit 5 items on desktop and 3 on mobile
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        const isMobile = window.innerWidth <= 768;
        const visibleCount = isMobile ? 3 : 5;
        const calculatedWidth = (containerWidth - (visibleCount - 1) * gap) / visibleCount;
        setCardWidth(calculatedWidth);
      }
    };
    
    const timer = setTimeout(updateSize, 50);

    window.addEventListener('resize', updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSize);
    };
  }, [displayList]);

  // Auto-play loop to advance one item
  useEffect(() => {
    if (displayList.length === 0) return;

    const slideNext = () => {
      setIsTransitioning(true);
      setOffsetX(cardWidth + gap);
    };

    const intervalId = setInterval(slideNext, 3000);
    return () => clearInterval(intervalId);
  }, [cardWidth, displayList]);

  // seamless shift at the end of slide animation
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    setOffsetX(0);
    setDisplayList((prev) => {
      const nextList = [...prev];
      const firstItem = nextList.shift();
      if (firstItem) {
        nextList.push(firstItem);
      }
      return nextList;
    });
  };

  if (displayList.length === 0) return null;

  return (
    <section className={styles.sectionLarge} style={{ overflow: 'hidden' }}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Contributors</h2>
        <span className={styles.sectionSubtitle}>Writers & Scholars</span>
      </div>

      <div ref={containerRef} className={styles.carouselContainer}>
        <div 
          className={styles.carouselTrack}
          style={{
            transform: `translateX(-${offsetX}px)`,
            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            display: 'flex',
            gap: `${gap}px`
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {displayList.map((author, index) => (
            <div 
              key={`${author.id}-${index}`} 
              className={styles.contributorCard}
              style={{
                width: `${cardWidth}px`,
                flexShrink: 0,
                alignItems: 'center'
              }}
            >
              <Link href={`/author/${author.slug}`} className={styles.avatarLink}>
                <div className={styles.avatarContainer} style={{ width: '120px', height: '120px', margin: '0 auto' }}>
                  {author.avatarUrl ? (
                    <Image
                      src={author.avatarUrl}
                      alt={author.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="120px"
                    />
                  ) : (
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
                  )}
                </div>
              </Link>
              <div style={{ textAlign: 'center', width: '100%', marginTop: '8px' }}>
                <h3 className={styles.contributorName} style={{ fontSize: '1.15rem', margin: '0 0 4px 0' }}>
                  <Link href={`/author/${author.slug}`}>{author.name}</Link>
                </h3>
                <span className={styles.contributorSpec} style={{ fontSize: '0.7rem' }}>{author.specialization}</span>
              </div>
              <div className={styles.contributorInterests} style={{ textAlign: 'center', width: '100%', fontSize: '0.8rem', minHeight: '68px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontWeight: '600', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '2px' }}>
                  Current Interest:
                </span>
                {author.currentInterests[0]}
              </div>
              <div style={{ width: '100%', textAlign: 'center', marginTop: 'auto' }}>
                <Link href={`/author/${author.slug}`} style={{ fontSize: '0.8rem', textDecoration: 'underline' }}>
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
