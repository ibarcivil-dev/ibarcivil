"use client";

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { ShieldCheck, Info, FileEdit, Users, Compass, Mail } from 'lucide-react';

export default function AdminDashboard() {
  const [articlesCount, setArticlesCount] = useState(0);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [issuesCount, setIssuesCount] = useState(0);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch article count
        const { count: artCount, error: artErr } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });

        // Fetch authors count
        const { count: authCount, error: authErr } = await supabase
          .from('authors')
          .select('*', { count: 'exact', head: true });

        // Fetch issues count
        const { count: issCount, error: issErr } = await supabase
          .from('issues')
          .select('*', { count: 'exact', head: true });

        // Fetch subscribers
        const { data: subsData, error: subsErr } = await supabase
          .from('newsletter_subscribers')
          .select('email')
          .order('created_at', { ascending: false });

        if (artCount !== null) setArticlesCount(artCount);
        if (authCount !== null) setAuthorsCount(authCount);
        if (issCount !== null) setIssuesCount(issCount);
        if (subsData) setSubscribers(subsData.map(s => s.email));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

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
        
        {/* Connection indicator */}
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
          <span>Supabase Connected</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Published Essays</span>
            <FileEdit size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <span className={styles.statValue}>{loading ? '...' : articlesCount}</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Contributors</span>
            <Users size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <span className={styles.statValue}>{loading ? '...' : authorsCount}</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Issues Curation</span>
            <Compass size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <span className={styles.statValue}>{loading ? '...' : issuesCount}</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Subscribers</span>
            <Mail size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <span className={styles.statValue}>{loading ? '...' : subscribers.length}</span>
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
                <strong>Note:</strong> The database is currently in active developer-testing mode. Modifications are applied directly in your Supabase project.
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
          {subscribers.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'var(--font-sans)' }}>
              No subscribers yet.
            </p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
