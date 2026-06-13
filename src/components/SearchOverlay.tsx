"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft } from 'lucide-react';
import styles from './SearchOverlay.module.css';
import { getArticles, getAuthors, getIssues } from '@/lib/mockDb';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Search logic
  const articles = getArticles();
  const authors = getAuthors();
  const issues = getIssues();

  const filteredArticles = query
    ? articles.filter(
        a =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredAuthors = query
    ? authors.filter(
        a =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.specialization.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredIssues = query
    ? issues.filter(
        i =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.theme.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Combine results to navigate easily with arrow keys
  const combinedResults: {
    type: 'article' | 'author' | 'issue';
    title: string;
    subtitle: string;
    url: string;
  }[] = [
    ...filteredArticles.map(a => ({
      type: 'article' as const,
      title: a.title,
      subtitle: `${a.isPerspective ? 'Perspective' : 'Essay'} • ${a.readingTime} min read`,
      url: `/article/${a.slug}`,
    })),
    ...filteredAuthors.map(a => ({
      type: 'author' as const,
      title: a.name,
      subtitle: `Writer • ${a.specialization}`,
      url: `/author/${a.slug}`,
    })),
    ...filteredIssues.map(i => ({
      type: 'issue' as const,
      title: `Issue ${i.number}: ${i.title}`,
      subtitle: `Thematic Issue • Theme: ${i.theme}`,
      url: `/issue/${i.id}`,
    })),
  ];

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle keyboard events (Escape, Arrows, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < combinedResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (combinedResults[selectedIndex]) {
          router.push(combinedResults[selectedIndex].url);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, combinedResults, onClose, router]);

  // Trap focus within the search dialog
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = overlayRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex="0"]'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      ref={overlayRef}
      onKeyDown={handleTabKey}
    >
      <div
        className={styles.modal}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search IBAR publication"
      >
        <div className={styles.inputWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            placeholder="Search essays, authors, issues..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
        </div>

        <div className={styles.results}>
          {query === '' ? (
            <div className={styles.noResults}>
              Type to begin searching essays, opinions, contributors, and issues.
            </div>
          ) : combinedResults.length === 0 ? (
            <div className={styles.noResults}>
              No matches found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div>
              {filteredArticles.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>Articles</div>
                  {filteredArticles.map((a, idx) => {
                    const overallIndex = idx;
                    const isActive = selectedIndex === overallIndex;
                    return (
                      <div
                        key={a.id}
                        className={`${styles.resultItem} ${isActive ? styles.active : ''}`}
                        onClick={() => {
                          router.push(`/article/${a.slug}`);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(overallIndex)}
                      >
                        <span className={styles.itemTitle}>{a.title}</span>
                        <span className={styles.itemSubtitle}>
                          Elena Rostova • {a.isPerspective ? 'Perspective' : 'Essay'} • {a.readingTime} min read
                        </span>
                      </div>
                    );
                  })}
                </>
              )}

              {filteredAuthors.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>Authors</div>
                  {filteredAuthors.map((a, idx) => {
                    const overallIndex = filteredArticles.length + idx;
                    const isActive = selectedIndex === overallIndex;
                    return (
                      <div
                        key={a.id}
                        className={`${styles.resultItem} ${isActive ? styles.active : ''}`}
                        onClick={() => {
                          router.push(`/author/${a.slug}`);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(overallIndex)}
                      >
                        <span className={styles.itemTitle}>{a.name}</span>
                        <span className={styles.itemSubtitle}>{a.specialization}</span>
                      </div>
                    );
                  })}
                </>
              )}

              {filteredIssues.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>Issues</div>
                  {filteredIssues.map((i, idx) => {
                    const overallIndex =
                      filteredArticles.length + filteredAuthors.length + idx;
                    const isActive = selectedIndex === overallIndex;
                    return (
                      <div
                        key={i.id}
                        className={`${styles.resultItem} ${isActive ? styles.active : ''}`}
                        onClick={() => {
                          router.push(`/issue/${i.id}`);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(overallIndex)}
                      >
                        <span className={styles.itemTitle}>Issue {i.number}: {i.title}</span>
                        <span className={styles.itemSubtitle}>Theme: {i.theme}</span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.shortcuts}>
            <span>
              <span className={styles.shortcut}>↑↓</span> to navigate
            </span>
            <span>
              <span className={styles.shortcut}>Enter</span> <CornerDownLeft size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> to open
            </span>
            <span>
              <span className={styles.shortcut}>Esc</span> to close
            </span>
          </div>
          <div>IBAR Webzine Search</div>
        </div>
      </div>
    </div>
  );
}
