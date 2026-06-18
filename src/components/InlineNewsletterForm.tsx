"use client";

import React, { useState } from 'react';
import styles from './InlineNewsletterForm.module.css';

export function InlineNewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate submission delay
    setTimeout(() => {
      setSubmitted(true);
      setEmail('');
    }, 400);
  };

  if (submitted) {
    return (
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.95rem',
        color: 'var(--accent)',
        fontWeight: '600',
        marginTop: '16px'
      }}>
        Thank you. You have been added to our reading list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.submitBtn}>
        Subscribe
      </button>
    </form>
  );
}
