"use client";

import React, { useState, useEffect } from 'react';
import { Share2, Link as LinkIcon, Mail, Check } from 'lucide-react';
import styles from './ArticlePage.module.css';

export function ArticleClientEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Reading a fascinating essay on IBAR: ");
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    if (typeof window === 'undefined') return;
    const subject = encodeURIComponent("Essay recommendation from IBAR");
    const body = encodeURIComponent(`I thought you might enjoy this essay from IBAR: ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className={styles.progressBar}
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Share Actions Bar */}
      <div className={styles.shareBar}>
        <button onClick={handleCopyLink} className={styles.shareBtn} aria-label="Copy article link">
          {copied ? <Check size={16} style={{ color: 'var(--accent)' }} /> : <LinkIcon size={16} />}
          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>
        <button onClick={handleTwitterShare} className={styles.shareBtn} aria-label="Share on Twitter">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
          </svg>
          <span>Share</span>
        </button>
        <button onClick={handleEmailShare} className={styles.shareBtn} aria-label="Share via Email">
          <Mail size={16} />
          <span>Email</span>
        </button>
      </div>
    </>
  );
}
