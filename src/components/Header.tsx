"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, ChevronDown, User } from 'lucide-react';
import styles from './Header.module.css';
import { SearchOverlay } from './SearchOverlay';
import { getTopics } from '@/lib/mockDb';

export function Header() {
  const [isCompressed, setIsCompressed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const topics = getTopics();

  // Handle scroll-compression
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsCompressed(true);
      } else {
        setIsCompressed(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener for search (⌘K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in form inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Avoid hydration mismatch for next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className={`${styles.header} ${isCompressed ? styles.compressed : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            IBAR
          </Link>

          {/* Navigation */}
          <nav>
            <ul className={styles.nav}>
              <li className={styles.navItem}>
                <Link href="/essays" className={styles.navLink}>
                  Essays
                </Link>
              </li>
              <li className={styles.navItem}>
                <span className={styles.navLink} tabIndex={0} role="button" aria-haspopup="true">
                  Topics <ChevronDown size={14} />
                </span>
                <ul className={styles.dropdown}>
                  {topics.map(topic => (
                    <li key={topic.id} className={styles.dropdownItem}>
                      <Link href={`/topic/${topic.slug}`} className={styles.dropdownLink}>
                        {topic.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={styles.navItem}>
                <Link href="/perspectives" className={styles.navLink}>
                  Perspectives
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/archive" className={styles.navLink}>
                  Archive
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/about" className={styles.navLink}>
                  About
                </Link>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Command search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={styles.searchBtn}
              aria-label="Open Search (⌘K or /)"
            >
              <span>Search</span>
              <kbd className={styles.kbd}>/</kbd>
            </button>

            {/* Admin Panel Link */}
            <Link href="/admin" className={styles.actionBtn} title="Admin Dashboard">
              <User size={18} />
              <span className="sr-only">Admin Dashboard</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={styles.actionBtn}
              aria-label="Toggle visual theme"
            >
              {mounted ? (
                resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </button>

            {/* Subscribe Action */}
            <Link href="/subscribe" className={styles.subscribeLink}>
              Subscribe
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer to prevent page content jumping behind fixed header */}
      <div className={styles.headerSpacer} />

      {/* Commands Palette overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
