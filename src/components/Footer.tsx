"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate subscription API call
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail('');
    }, 400);
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.logoCol}>
            <Link href="/" className={styles.logo}>
              IBAR
            </Link>
            <p className={styles.desc}>
              An independent digital publication dedicated to long-form thinking, essays, culture, society, and depth over speed.
            </p>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h4 className={styles.colTitle}>Sections</h4>
            <ul className={styles.links}>
              <li>
                <Link href="/essays" className={styles.link}>
                  Essays
                </Link>
              </li>
              <li>
                <Link href="/perspectives" className={styles.link}>
                  Perspectives
                </Link>
              </li>
              <li>
                <Link href="/archive" className={styles.link}>
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.link}>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div>
            <h4 className={styles.colTitle}>Topics</h4>
            <ul className={styles.links}>
              <li>
                <Link href="/topic/technology" className={styles.link}>
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/topic/society" className={styles.link}>
                  Society
                </Link>
              </li>
              <li>
                <Link href="/topic/philosophy" className={styles.link}>
                  Philosophy
                </Link>
              </li>
              <li>
                <Link href="/topic/science" className={styles.link}>
                  Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.colTitle}>Newsletter</h4>
            <p className={styles.newsletterDesc}>
              Receive our latest essays, notebooks, and reading lists twice monthly. No metrics, no spam.
            </p>
            {isSubscribed ? (
              <p className={styles.successMsg}>Thank you. You have been added to our reading list.</p>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className={styles.input}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.metaText}>
            © {new Date().getFullYear()} IBAR. All rights reserved.
          </div>
          <div className={styles.metaText}>
            Designed for Readers. Built with Restraint.
          </div>
        </div>
      </div>
    </footer>
  );
}
