"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function SubscribePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState('both'); // both, essays, notes
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 400);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Subscribe</h1>
      <p className={styles.desc}>
        Join our reader list. We publish twice monthly, delivering long-form essays, short notebooks, and curated recommendations straight to your letterbox.
      </p>

      {isSubmitted ? (
        <div className={styles.successMsg}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '16px' }}>
            Welcome to IBAR
          </h2>
          <p>
            Thank you for subscribing, {name || 'reader'}. You have been added to our circle of depth-oriented readers. You will receive our next issue notification shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="name">
              Your Name (Optional)
            </label>
            <input
              type="text"
              id="name"
              className={styles.input}
              placeholder="Elena Rostova"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="elena@ibar.org"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Curation Preferences</label>
            <select
              value={preferences}
              onChange={e => setPreferences(e.target.value)}
              className={styles.input}
              style={{ border: 'none', borderBottom: '1px solid var(--border)', background: 'transparent' }}
            >
              <option value="both">All Curations (Essays & Notebooks)</option>
              <option value="essays">Essays Only (Long-form)</option>
              <option value="notes">Notebooks Only (Fragments & Observations)</option>
            </select>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Join the List
          </button>
        </form>
      )}
    </div>
  );
}
