"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { Settings, Globe, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function AdminSettings() {
  const [twitterUrl, setTwitterUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [footerCopyright, setFooterCopyright] = useState('');
  const [settingsId, setSettingsId] = useState<string | null>(null);
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      let activeSettings = data?.[0];

      if (!activeSettings) {
        // Insert a default row if none exists
        const placeholder = {
          twitter_url: 'https://twitter.com/ibar',
          github_url: 'https://github.com/ibar',
          instagram_url: 'https://instagram.com/ibar',
          phone_number: '+1 (555) 019-2834',
          contact_email: 'editorial@ibar.com',
          footer_copyright: '© 2026 IBAR. All rights reserved.',
          updated_at: new Date().toISOString()
        };

        const { data: inserted } = await supabase
          .from('site_settings')
          .insert([placeholder])
          .select();

        activeSettings = inserted?.[0];
      }

      if (activeSettings) {
        setTwitterUrl(activeSettings.twitter_url || '');
        setGithubUrl(activeSettings.github_url || '');
        setInstagramUrl(activeSettings.instagram_url || '');
        setPhoneNumber(activeSettings.phone_number || '');
        setContactEmail(activeSettings.contact_email || '');
        setFooterCopyright(activeSettings.footer_copyright || '');
        setSettingsId(activeSettings.id);
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsId) return;

    try {
      const dbPayload = {
        twitter_url: twitterUrl,
        github_url: githubUrl,
        instagram_url: instagramUrl,
        phone_number: phoneNumber,
        contact_email: contactEmail,
        footer_copyright: footerCopyright,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('site_settings')
        .update(dbPayload)
        .eq('id', settingsId);

      if (error) throw error;
      setMessage('Site settings updated successfully.');
      setTimeout(() => {
        setMessage('');
      }, 2500);
    } catch (err: any) {
      console.error('Error saving site settings:', err);
      setMessage(`Error saving settings: ${err.message || err}`);
    }
  };

  if (loading) return <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', padding: '40px' }}>Loading site configuration...</div>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Site Settings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Configure social connection links, office directories, email routing, and footer statements.
          </p>
        </div>
      </div>

      {message && (
        <div style={{
          backgroundColor: 'var(--muted)',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          padding: '16px',
          marginBottom: '24px',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className={styles.formCard}>
        {/* Contact info section */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.4rem',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '8px'
        }}>
          Contact Directories
        </h2>
        <div className={styles.formGrid} style={{ marginBottom: '32px' }}>
          <div className={styles.formGroup}>
            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={12} style={{ color: 'var(--accent)' }} />
              <span>Contact Phone Number</span>
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="+1 (555) 019-2834"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={12} style={{ color: 'var(--accent)' }} />
              <span>Editorial Email Address</span>
            </label>
            <input
              type="email"
              className={styles.input}
              placeholder="editorial@ibar.com"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Social connections section */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.4rem',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '8px'
        }}>
          Social Media Handles
        </h2>
        <div className={styles.formGrid} style={{ marginBottom: '32px' }}>
          <div className={styles.formGroup}>
            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={12} style={{ color: 'var(--accent)' }} />
              <span>Twitter / X Link</span>
            </label>
            <input
              type="url"
              className={styles.input}
              placeholder="https://twitter.com/username"
              value={twitterUrl}
              onChange={e => setTwitterUrl(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={12} style={{ color: 'var(--accent)' }} />
              <span>Instagram Link</span>
            </label>
            <input
              type="url"
              className={styles.input}
              placeholder="https://instagram.com/username"
              value={instagramUrl}
              onChange={e => setInstagramUrl(e.target.value)}
            />
          </div>

          <div className={styles.formGroupFull}>
            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={12} style={{ color: 'var(--accent)' }} />
              <span>GitHub Repository / Account</span>
            </label>
            <input
              type="url"
              className={styles.input}
              placeholder="https://github.com/organization"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Footer & Copy section */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.4rem',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '8px'
        }}>
          Footer & Metadata
        </h2>
        <div className={styles.formGrid} style={{ marginBottom: '32px' }}>
          <div className={styles.formGroupFull}>
            <label className={styles.label}>Copyright Notice</label>
            <input
              type="text"
              className={styles.input}
              placeholder="© 2026 IBAR. All rights reserved."
              value={footerCopyright}
              onChange={e => setFooterCopyright(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.btnGroup}>
          <button type="submit" className={styles.btnPrimary} style={{ width: '100%' }}>
            Save Site Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
