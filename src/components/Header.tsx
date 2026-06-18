"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';
import { SearchOverlay } from './SearchOverlay';
import { getTopics } from '@/lib/mockDb';

export function Header() {
  const [isCompressed, setIsCompressed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTopicsExpanded, setIsTopicsExpanded] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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

  // Prevent page scroll when mobile navigation is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header className={`${styles.header} ${isCompressed ? styles.compressed : ''} ${isMobileMenuOpen ? styles.headerActive : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
            IBAR
          </Link>

          {/* Navigation (Desktop) */}
          <nav className={styles.desktopNav}>
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

          {/* Actions (Desktop) */}
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

          {/* Mobile Menu Trigger (Hamburger) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.drawerOpen : ''}`}>
        <nav className={styles.drawerNav}>
          <ul className={styles.drawerLinks}>
            <li>
              <Link href="/essays" className={styles.drawerLink}>
                Essays
              </Link>
            </li>
            <li>
              <button
                className={styles.drawerDropdownTrigger}
                onClick={() => setIsTopicsExpanded(!isTopicsExpanded)}
                aria-expanded={isTopicsExpanded}
              >
                <span>Topics</span>
                <ChevronDown size={18} style={{ transform: isTopicsExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
              </button>
              <ul className={`${styles.drawerDropdown} ${isTopicsExpanded ? styles.drawerDropdownOpen : ''}`}>
                {topics.map(topic => (
                  <li key={topic.id}>
                    <Link href={`/topic/${topic.slug}`} className={styles.drawerDropdownLink}>
                      {topic.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/perspectives" className={styles.drawerLink}>
                Perspectives
              </Link>
            </li>
            <li>
              <Link href="/archive" className={styles.drawerLink}>
                Archive
              </Link>
            </li>
            <li>
              <Link href="/about" className={styles.drawerLink}>
                About
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.drawerFooter}>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsSearchOpen(true);
            }}
            className={styles.drawerSearchBtn}
          >
            Search Publication
          </button>
          
          <div className={styles.drawerActionsRow}>
            <button onClick={toggleTheme} className={styles.drawerThemeBtn} aria-label="Toggle visual theme">
              {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{resolvedTheme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
            
            <Link href="/subscribe" className={styles.drawerSubscribeLink}>
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer to prevent page content jumping behind fixed header */}
      <div className={styles.headerSpacer} />

      {/* Commands Palette overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
