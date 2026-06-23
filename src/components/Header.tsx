"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, ChevronDown, Search, X, Sun } from 'lucide-react';
import Image from 'next/image';
import styles from './Header.module.css';
import { getTopics, getArticles, getAuthors } from '@/lib/mockDb';

export function Header() {
  const [isCompressed, setIsCompressed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTopicsExpanded, setIsTopicsExpanded] = useState(false);
  const [isUtilOpen, setIsUtilOpen] = useState(false);

  // ── Search
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const utilRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const topics = getTopics();
  const articles = getArticles();
  const authors = getAuthors();

  // Live search results
  const filteredArticles = searchQuery.length > 1
    ? articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const filteredAuthors = searchQuery.length > 1
    ? authors.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 2)
    : [];

  const hasResults = filteredArticles.length > 0 || filteredAuthors.length > 0;

  const openSearch = useCallback(() => {
    setIsSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 60);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchExpanded(false);
    setSearchQuery('');
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isSearchExpanded && searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isSearchExpanded, closeSearch]);

  // Close util on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isUtilOpen && utilRef.current && !utilRef.current.contains(e.target as Node)) {
        setIsUtilOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isUtilOpen]);



  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
      else if (e.key === '/') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape') { closeSearch(); setIsUtilOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, closeSearch]);

  useEffect(() => {
    const handleScroll = () => setIsCompressed(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close everything on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    closeSearch();
  }, [pathname]);

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <>
      <header className={`${styles.header} ${isCompressed ? styles.compressed : ''} ${isMobileMenuOpen ? styles.headerActive : ''}`}>
        <div className={styles.container}>

          {/* ── Logo ── */}
          <Link href="/" className={styles.logo} onClick={() => { setIsMobileMenuOpen(false); }}>
            <Image src="/logo.png" alt="IBAR" width={260} height={80} className={styles.logoImage} priority />
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className={styles.desktopNav}>
            <ul className={styles.nav}>
              <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>Home</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/essays" className={styles.navLink}>Essays</Link>
              </li>
              <li className={styles.navItem}>
                <span className={styles.navLink} tabIndex={0} role="button" aria-haspopup="true">
                  Topics <ChevronDown size={12} />
                </span>
                <ul className={styles.dropdown}>
                  {topics.map(topic => (
                    <li key={topic.id} className={styles.dropdownItem}>
                      <Link href={`/topic/${topic.slug}`} className={styles.dropdownLink}>{topic.name}</Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={styles.navItem}>
                <Link href="/perspectives" className={styles.navLink}>Perspectives</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/archive" className={styles.navLink}>Archive</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/about" className={styles.navLink}>About</Link>
              </li>
            </ul>
          </nav>

          {/* ── Desktop Right: Search + Util toggler ── */}
          <div className={styles.actions}>

            {/* Expanding pill search */}
            <div
              ref={searchContainerRef}
              className={`${styles.searchPill} ${isSearchExpanded ? styles.searchPillExpanded : ''}`}
            >
              {!isSearchExpanded ? (
                <button onClick={openSearch} className={styles.searchIconBtn} aria-label="Search (/)">
                  <Search size={16} strokeWidth={2} />
                </button>
              ) : (
                <>
                  <Search size={14} strokeWidth={2} className={styles.searchPillIcon} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className={styles.searchPillInput}
                    placeholder="Search essays, authors…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    aria-label="Search"
                  />
                  <button onClick={closeSearch} className={styles.searchCloseBtn} aria-label="Close">
                    <X size={13} strokeWidth={2.5} />
                  </button>
                </>
              )}

              {/* Live results — only when expanded and query present */}
              {isSearchExpanded && searchQuery.length > 1 && (
                <div className={styles.searchResults}>
                  {!hasResults ? (
                    <div className={styles.searchNoResult}>No results for "{searchQuery}"</div>
                  ) : (
                    <>
                      {filteredArticles.length > 0 && (
                        <div className={styles.searchGroup}>
                          <div className={styles.searchGroupLabel}>Articles</div>
                          {filteredArticles.map(a => (
                            <button key={a.id} className={styles.searchItem}
                              onClick={() => { router.push(`/article/${a.slug}`); closeSearch(); }}>
                              <span className={styles.searchItemTitle}>{a.title}</span>
                              <span className={styles.searchItemMeta}>{a.readingTime} min read</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {filteredAuthors.length > 0 && (
                        <div className={styles.searchGroup}>
                          <div className={styles.searchGroupLabel}>Authors</div>
                          {filteredAuthors.map(a => (
                            <button key={a.id} className={styles.searchItem}
                              onClick={() => { router.push(`/author/${a.slug}`); closeSearch(); }}>
                              <span className={styles.searchItemTitle}>{a.name}</span>
                              <span className={styles.searchItemMeta}>{a.specialization}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ── Submit CTA ── */}
            <Link href="/submit" className={styles.submitCta}>Submit</Link>

            {/* ── Veggie Burger → dropdown (Subscribe + Theme) ── */}
            <div ref={utilRef} className={styles.veggieBurgerWrap}>
              <button
                onClick={() => { setIsUtilOpen(o => !o); closeSearch(); }}
                className={`${styles.veggieBurgerBtn} ${isUtilOpen ? styles.veggieBurgerBtnActive : ''}`}
                aria-label="Menu"
                aria-expanded={isUtilOpen}
              >
                {/* Custom 2-line veggie burger SVG */}
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                  <rect y="0" width="18" height="2" rx="1" fill="currentColor" />
                  <rect y="10" width="18" height="2" rx="1" fill="currentColor" />
                </svg>
              </button>

              {/* Dropdown panel */}
              <div className={`${styles.veggieDrop} ${isUtilOpen ? styles.veggieDropOpen : ''}`}
                role="menu" aria-label="Navigation utilities">

                {/* Theme toggle row */}
                <div className={styles.veggieDropThemeRow}>
                  <span className={styles.veggieDropLabel}>
                    {mounted ? (resolvedTheme === 'dark' ? 'Dark mode' : 'Light mode') : 'Theme'}
                  </span>
                  <button
                    onClick={toggleTheme}
                    className={styles.themeToggle}
                    aria-label="Toggle theme"
                  >
                    <span className={`${styles.themeTrack} ${mounted && resolvedTheme === 'dark' ? styles.themeTrackDark : ''}`}>
                      <span className={styles.themeThumb}>
                        {mounted
                          ? (resolvedTheme === 'dark' ? <Moon size={9} strokeWidth={2.5} /> : <Sun size={9} strokeWidth={2.5} />)
                          : <Moon size={9} strokeWidth={2.5} />}
                      </span>
                    </span>
                  </button>
                </div>

                <div className={styles.veggieDropDivider} />

                {/* Subscribe CTA */}
                <Link href="/subscribe" className={styles.veggieDropSubscribe} onClick={() => setIsUtilOpen(false)}>
                  Subscribe to IBAR
                </Link>
              </div>
            </div>
          </div>

          {/* ── Mobile: hamburger only ── */}
          <button
            onClick={() => setIsMobileMenuOpen(m => !m)}
            className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
            aria-label="Toggle navigation"
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
            <li><Link href="/essays" className={styles.drawerLink}>Essays</Link></li>
            <li>
              <button
                className={styles.drawerDropdownTrigger}
                onClick={() => setIsTopicsExpanded(t => !t)}
                aria-expanded={isTopicsExpanded}
              >
                <span>Topics</span>
                <ChevronDown size={18} style={{ transform: isTopicsExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.22s ease' }} />
              </button>
              <ul className={`${styles.drawerDropdown} ${isTopicsExpanded ? styles.drawerDropdownOpen : ''}`}>
                {topics.map(topic => (
                  <li key={topic.id}>
                    <Link href={`/topic/${topic.slug}`} className={styles.drawerDropdownLink}>{topic.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li><Link href="/perspectives" className={styles.drawerLink}>Perspectives</Link></li>
            <li><Link href="/archive" className={styles.drawerLink}>Archive</Link></li>
            <li><Link href="/about" className={styles.drawerLink}>About</Link></li>
            <li><Link href="/submit" className={styles.drawerLink}>Submit</Link></li>
          </ul>
        </nav>

        {/* Mobile drawer footer actions */}
        <div className={styles.drawerFooter}>
          <Link href="/subscribe" className={styles.drawerSubscribeBtn}>Subscribe</Link>
          <button onClick={toggleTheme} className={styles.drawerThemeBtn}>
            {mounted
              ? (resolvedTheme === 'dark'
                ? <><Sun size={16} /><span>Light Mode</span></>
                : <><Moon size={16} /><span>Dark Mode</span></>)
              : <><Moon size={16} /><span>Dark Mode</span></>
            }
          </button>
        </div>
      </div>

      {/* Header spacer */}
      <div className={styles.headerSpacer} />
    </>
  );
}
