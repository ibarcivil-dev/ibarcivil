"use client";

import React, { useState } from 'react';
import styles from '../app/(public)/page.module.css';

export function HomepageNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate subscription API request
    setTimeout(() => {
      setSubmitted(true);
      setEmail('');
    }, 450);
  };

  return (
    <section className={styles.newsletterSection}>
      <div className={styles.newsletterWrapper}>
        <h3 className={styles.newsletterTitle}>Keep Reading</h3>
        <p className={styles.newsletterDesc}>
          Join our reader list to receive our print issues announcement and twice-monthly essays. Built with respect for your time.
        </p>
        
        {submitted ? (
          <p className={styles.newsletterDesc} style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
            Thank you. You have been added to our subscription list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Enter your email address"
              className={styles.newsletterInput}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.newsletterSubmit}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
