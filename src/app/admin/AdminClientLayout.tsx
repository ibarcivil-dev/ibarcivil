"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  Compass,
  Sliders,
  ArrowLeft,
  Settings,
  BookOpen,
  LogOut,
  Mail,
  Archive,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import styles from './admin.module.css';

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "ibar_admin_session=; path=/; max-age=0; SameSite=Lax";
    router.push('/admin/login');
    router.refresh();
  };

  // If we are loading and not on the login page, render a full-screen premium loader
  if (loading && pathname !== '/admin/login') {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Verifying Authentication...
          </span>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}} />
        </div>
      </div>
    );
  }

  // If we are on the login page or not authenticated, render content only
  if (pathname === '/admin/login' || (!authenticated && pathname !== '/admin/login')) {
    return <>{children}</>;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> },
    { label: 'Articles', href: '/admin/articles', icon: <FileText size={16} /> },
    { label: 'Perspectives', href: '/admin/perspectives', icon: <BookOpen size={16} /> },
    { label: 'Issues', href: '/admin/issues', icon: <Compass size={16} /> },
    { label: 'Authors', href: '/admin/authors', icon: <Users size={16} /> },
    { label: 'Homepage Curation', href: '/admin/homepage', icon: <Sliders size={16} /> },
    { label: 'Archive Curation', href: '/admin/archive', icon: <Archive size={16} /> },
    { label: 'Subscribers', href: '/admin/subscribers', icon: <Mail size={16} /> },
    { label: 'Site Settings', href: '/admin/settings', icon: <Settings size={16} /> },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar Nav */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.brand}>IBAR Admin</div>
          <nav>
            <ul className={styles.nav}>
              {navItems.map(item => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Logout Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
          <button
            onClick={() => setShowSignOutConfirm(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 16px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'color 0.2s ease'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className={styles.main}>{children}</main>

      {/* Premium Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          fontFamily: 'var(--font-sans)'
        }}>
          <div style={{
            width: '90%',
            maxWidth: '380px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderRadius: '2px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: 'var(--text-primary)',
                margin: 0,
                fontWeight: 400
              }}>
                Sign Out Request
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                margin: 0
              }}>
                Are you sure you want to end your editorial session? Any unsaved edits will be discarded.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  borderRadius: '1px',
                  transition: 'all 0.2s ease'
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'rgb(239, 68, 68)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  borderRadius: '1px',
                  transition: 'all 0.2s ease'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
