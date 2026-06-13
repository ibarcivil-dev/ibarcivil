"use client";

import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      width: '100%',
      maxWidth: '420px',
      borderBottom: '1px solid var(--text-primary)',
      paddingBottom: '8px',
      marginTop: '16px'
    }}>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{
          background: 'transparent',
          border: 'none',
          width: '100%',
          color: 'var(--text-primary)',
          fontSize: '0.95rem',
          outline: 'none',
          fontFamily: 'var(--font-sans)'
        }}
      />
      <button type="submit" style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: '600',
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap',
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}>
        Subscribe
      </button>
    </form>
  );
}
