"use client";

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { ShieldCheck, Info, FileEdit, Users, Compass, Mail, TrendingUp, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [articlesCount, setArticlesCount] = useState(0);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [issuesCount, setIssuesCount] = useState(0);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample analytics data for the SVG graph (representing the last 6 months)
  const analyticsData = [
    { month: 'Jan', pageviews: 1200, subscribers: 120 },
    { month: 'Feb', pageviews: 2100, subscribers: 180 },
    { month: 'Mar', pageviews: 1800, subscribers: 240 },
    { month: 'Apr', pageviews: 2800, subscribers: 310 },
    { month: 'May', pageviews: 3600, subscribers: 450 },
    { month: 'Jun', pageviews: 4500, subscribers: 580 },
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch article count
        const { count: artCount } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });

        // Fetch authors count
        const { count: authCount } = await supabase
          .from('authors')
          .select('*', { count: 'exact', head: true });

        // Fetch issues count
        const { count: issCount } = await supabase
          .from('issues')
          .select('*', { count: 'exact', head: true });

        // Fetch subscribers
        const { data: subsData } = await supabase
          .from('newsletter_subscribers')
          .select('email')
          .order('created_at', { ascending: false });

        if (artCount !== null) setArticlesCount(artCount);
        if (authCount !== null) setAuthorsCount(authCount);
        if (issCount !== null) setIssuesCount(issCount);
        if (subsData) setSubscribers(subsData.map((s: any) => s.email));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // SVG Chart variables
  const chartWidth = 500;
  const chartHeight = 160;
  const padding = 25;
  const points = analyticsData.map((d, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (analyticsData.length - 1);
    // Scale pageviews to fit chart height
    const maxVal = 5000;
    const y = chartHeight - padding - (d.pageviews * (chartHeight - padding * 2)) / maxVal;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            System activity overview and curation portal.
          </p>
        </div>
        
        {/* Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'var(--muted)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.85rem',
          color: 'var(--text-primary)'
        }}>
          <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
          <span>System Authenticated</span>
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

      {/* Graph and Details Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '32px', marginBottom: '32px' }}>
        
        {/* Readership growth Graph */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: 0 }}>
                Audience Activity
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Monthly pageviews and reader traffic growth trend.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
              <TrendingUp size={16} />
              <span>+35.4% growth</span>
            </div>
          </div>

          {/* SVG Graph Component */}
          <div style={{ width: '100%', position: 'relative', marginTop: '10px' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3" />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3" />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--border)" strokeWidth="0.75" />

              {/* Gradient Area */}
              <path d={areaPath} fill="url(#chartGradient)" />

              {/* Line */}
              <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="var(--surface)"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    style={{ transition: 'r 0.2s ease', cursor: 'pointer' }}
                  />
                  {/* Axis Label */}
                  <text
                    x={p.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    fill="var(--text-secondary)"
                    fontSize="9"
                    fontFamily="var(--font-sans)"
                  >
                    {p.month}
                  </text>
                  {/* Value Tip */}
                  <text
                    x={p.x}
                    y={p.y - 10}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="var(--font-sans)"
                  >
                    {p.pageviews}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Curation Welcome Information */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '12px' }}>
              Curation Center
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
              Use the sidebar panel to edit publishing status, schedule new issues, update writer directories, and configure homepage layouts.
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            backgroundColor: 'var(--muted)',
            padding: '16px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
            marginTop: '20px'
          }}>
            <Calendar size={18} style={{ flexShrink: 0, color: 'var(--accent)' }} />
            <span>
              <strong>Editorial Notice:</strong> Publication changes take effect immediately across all live web servers. Please review drafts before publishing.
            </span>
          </div>
        </div>
      </div>

      {/* Layout Split: Subscribers */}
      <div style={{ display: 'grid', gridTemplateColumns: '12fr', gap: '32px' }}>
        {/* Subscribers list */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px', margin: 0 }}>
            Recent Newsletter Subscribers
          </h3>
          {subscribers.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: 'var(--font-sans)', margin: 0 }}>
              No subscribers registered yet.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '12px',
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {subscribers.map((sub, i) => (
                <div key={i} style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--muted)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
