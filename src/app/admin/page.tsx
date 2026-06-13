"use client";

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import {
  getArticles,
  getAuthors,
  getIssues,
} from '@/lib/mockDb';
import { ShieldCheck, Info, FileEdit, Users, Compass, Mail } from 'lucide-react';

export default function AdminDashboard() {
  const [articles, setArticles] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  
  // Simulated Subscribers state
  const [subscribers, setSubscribers] = useState<string[]>([
    'reader.one@philosophy.edu',
    'curious.mind@deepthinking.org',
    'longform.lover@culturefeed.com',
    'editor@modernsociety.com'
  ]);

  useEffect(() => {
    // Populate data
    setArticles(getArticles());
    setAuthors(getAuthors());
    setIssues(getIssues());
  }, []);

  const totalPublished = articles.length;
  const totalAuthors = authors.length;
  const totalIssues = issues.length;

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Overview of IBAR publication and curation systems.
          </p>
        </div>
        
        {/* Mock Mode indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'var(--muted)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem'
        }}>
          <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
          <span>Local Mock Sandbox</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Published Essays</span>
            <FileEdit size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <span className={styles.statValue}>{totalPublished}</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Contributors</span>
            <Users size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <span className={styles.statValue}>{totalAuthors}</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Issues Curation</span>
            <Compass size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <span className={styles.statValue}>{totalIssues}</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Subscribers</span>
            <Mail size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <span className={styles.statValue}>{subscribers.length}</span>
        </div>
      </div>

      {/* Layout Split: Recent Activity & Subscribers */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '32px' }}>
        
        {/* Curation Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '32px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '16px' }}>
              Welcome to the IBAR Curation Center
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              This dashboard provides editorial oversight over IBAR. You can review all essays, compile thematic issues, curate the homepage configuration, and manage contributor bios.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              backgroundColor: 'var(--muted)',
              padding: '16px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.4'
            }}>
              <Info size={24} style={{ flexShrink: 0, color: 'var(--accent)' }} />
              <span>
                <strong>Note:</strong> The database is currently in mock developer-testing mode. Modifications are simulated locally on this client interface.
              </span>
            </div>
          </div>
        </div>

        {/* Subscribers list */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Recent Subscribers
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {subscribers.map((sub, i) => (
              <li key={i} style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                <span>{sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
