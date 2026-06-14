"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ShieldAlert, KeyRound, Mail, Loader2, Eye, EyeOff, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [showCredentialsHint, setShowCredentialsHint] = useState(false);

  useEffect(() => {
    document.title = "Sign In | Admin Portal";
    
    const hasRealEnv =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
    setIsMock(!hasRealEnv);

    async function checkCurrentSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        window.location.href = '/admin';
      }
    }
    checkCurrentSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Authentication failed');
      } else if (data?.session || data?.user) {
        // Set the session cookie
        document.cookie = "ibar_admin_session=true; path=/; max-age=86400; SameSite=Lax";
        // Use window.location.href to guarantee the server receives the cookie on the redirect request
        window.location.href = '/admin';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0c0c0e', // Sleek dark mode background
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-sans)',
      backgroundImage: 'radial-gradient(circle at top right, rgba(122, 62, 43, 0.08), transparent 40%), radial-gradient(circle at bottom left, rgba(20, 20, 25, 0.8), transparent 50%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#141417',
        border: '1px solid #27272a',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        position: 'relative',
        borderRadius: '2px'
      }}>
        {/* Accent Top Border Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: 'var(--accent)'
        }} />

        {/* Portal Icon Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(122, 62, 43, 0.1)',
            border: '1px solid rgba(122, 62, 43, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <Lock size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              color: '#f4f4f5',
              margin: 0,
              fontWeight: 400,
              letterSpacing: '-0.02em'
            }}>
              Curation Portal
            </h1>
            <p style={{
              color: '#a1a1aa',
              fontSize: '0.85rem',
              margin: 0
            }}>
              Authenticate to manage the digital webzine.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5',
            padding: '12px 16px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            lineHeight: '1.4'
          }}>
            <ShieldAlert size={16} style={{ flexShrink: 0, color: '#f87171' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              color: '#a1a1aa'
            }}>
              Corporate Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717a'
              }} />
              <input
                type="email"
                required
                placeholder="editor@ibar.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  border: '1px solid #27272a',
                  backgroundColor: '#09090b',
                  color: '#f4f4f5',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  borderRadius: '1px'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = '#27272a'}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
              color: '#a1a1aa'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={15} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717a'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  border: '1px solid #27272a',
                  backgroundColor: '#09090b',
                  color: '#f4f4f5',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  borderRadius: '1px'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = '#27272a'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'opacity 0.2s ease',
              borderRadius: '1px'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {loading ? (
              <>
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Authorizing Portal Access...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Development credentials helper */}
        {isMock && (
          <div style={{ borderTop: '1px dashed #27272a', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setShowCredentialsHint(!showCredentialsHint)}
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#71717a',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textAlign: 'left',
                padding: 0,
                textDecoration: 'underline'
              }}
            >
              {showCredentialsHint ? 'Hide test login details' : 'Show test login details'}
            </button>
            
            {showCredentialsHint && (
              <div style={{
                backgroundColor: '#09090b',
                border: '1px solid #27272a',
                padding: '12px',
                fontSize: '0.75rem',
                color: '#a1a1aa',
                lineHeight: '1.4'
              }}>
                <span style={{ fontWeight: 600, color: '#f4f4f5', display: 'block', marginBottom: '2px' }}>
                  Mock Credentials
                </span>
                Email: <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>admin@ibar.com</span><br />
                Password: <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>admin123</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
