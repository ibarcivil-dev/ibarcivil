"use client";

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { supabase } from '@/lib/supabaseClient';
import { Mail, Search, Trash2 } from 'lucide-react';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setSubscribers(data);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    const confirmDelete = window.confirm(`Remove subscriber "${email}" from the newsletter list?`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage(`Successfully removed subscriber: ${email}`);
      await fetchSubscribers();
      
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (err: any) {
      console.error('Error deleting subscriber:', err);
      setMessage(`Error removing subscriber: ${err.message || err}`);
    }
  };

  // Filter subscribers based on search query
  const filteredSubscribers = subscribers.filter(s =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Subscribers</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage newsletter subscribers, mailing directories, and reader engagement logs.
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

      {/* Curation Search Tool */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '12px 16px',
        marginBottom: '24px',
        maxWidth: '450px'
      }}>
        <Search size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search subscriber email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            width: '100%'
          }}
        />
      </div>

      {loading ? (
        <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', padding: '40px 0' }}>
          Loading subscribers from database...
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Email Address</th>
                <th className={styles.th}>Registration Date</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.td} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px' }}>
                    {searchQuery ? 'No matching subscriber emails found.' : 'No subscribers in the newsletter list.'}
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map(sub => (
                  <tr key={sub.id} className={styles.tr}>
                    <td className={styles.td} style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} style={{ color: 'var(--accent)' }} />
                      <span>{sub.email}</span>
                    </td>
                    <td className={styles.td}>
                      {new Date(sub.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className={styles.td}>
                      <span className={styles.badge} style={{ backgroundColor: 'rgba(122, 62, 43, 0.1)', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                        Active
                      </span>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '50%',
                          transition: 'background-color 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
