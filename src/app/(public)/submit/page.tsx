"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabaseClient';
import {
  Send, FileText, User, Mail, BookOpen, Feather, CheckCircle,
  AlertCircle, Phone, Paperclip, Bold, Italic, Heading2,
  List, Quote, AlignRight, AlignLeft, Maximize2, Minimize2,
  Eye, EyeOff, X
} from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

function wordCount(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function charCount(text: string) {
  return text.length;
}

// Minimal toolbar action: wraps selection or inserts markdown syntax
function applyFormat(
  textarea: HTMLTextAreaElement,
  syntax: { prefix?: string; suffix?: string; linePrefix?: string }
) {
  const { selectionStart: start, selectionEnd: end, value } = textarea;
  const selected = value.slice(start, end);

  let replacement = '';
  const pfx = syntax.prefix ?? '';
  const sfx = syntax.suffix ?? pfx;
  if (syntax.linePrefix) {
    const lines = (selected || 'Your text here').split('\n');
    replacement = lines.map(l => `${syntax.linePrefix}${l}`).join('\n');
  } else {
    replacement = `${pfx}${selected || 'Your text here'}${sfx}`;
  }

  const newValue = value.slice(0, start) + replacement + value.slice(end);
  const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  if (nativeInputSetter) {
    nativeInputSetter.call(textarea, newValue);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
  textarea.focus();
  const selStart = start + (syntax.linePrefix ? (syntax.linePrefix.length) : pfx.length);
  const selEnd = start + replacement.length - (syntax.linePrefix ? 0 : sfx.length);
  textarea.setSelectionRange(selStart, selEnd);
}

export default function SubmitPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [rtlMode, setRtlMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    author_name: '',
    author_email: '',
    author_phone: '',
    author_bio: '',
    title: '',
    subtitle: '',
    abstract: '',
    content: '',
    category: 'essay',
    language: 'english',
    notes: '',
  });

  // Auto-sync RTL with language selection
  useEffect(() => {
    setRtlMode(form.language === 'urdu');
  }, [form.language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, content: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError('');
    if (!file) return;

    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'text/markdown'];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!allowed.includes(file.type) && !file.name.endsWith('.md')) {
      setUploadError('Only PDF, Word (.doc / .docx), plain text, or Markdown files are accepted.');
      return;
    }
    if (file.size > maxSize) {
      setUploadError('File size must not exceed 10 MB.');
      return;
    }
    setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const applyToolbarAction = useCallback((syntax: { prefix?: string; suffix?: string; linePrefix?: string }) => {
    if (contentRef.current) applyFormat(contentRef.current, syntax);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author_name || !form.author_email || !form.title || !form.content || !form.abstract) {
      setErrorMsg('Please fill in all required fields marked with *.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('submissions').insert([{
        author_name: form.author_name,
        author_email: form.author_email,
        author_phone: form.author_phone || null,
        author_bio: form.author_bio,
        title: form.title,
        subtitle: form.subtitle,
        abstract: form.abstract,
        content: form.content,
        category: form.category,
        language: form.language,
        notes: form.notes,
        file_name: uploadedFile?.name || null,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      }]);

      if (error) throw error;
      setStatus('success');
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const words = wordCount(form.content);
  const chars = charCount(form.content);
  const readTime = Math.max(1, Math.round(words / 200));

  // Simple Markdown → HTML preview
  const previewHtml = form.content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|b|l|p])(.+)/gm, '$1');

  if (status === 'success') {
    return (
      <div className={styles.page}>
        <div className={styles.successWrapper}>
          <div className={styles.successIcon}>
            <CheckCircle size={52} strokeWidth={1.25} />
          </div>
          <h1 className={styles.successTitle}>Submission Received</h1>
          <p className={styles.successDesc}>
            Thank you for submitting to IBAR. Your work has been passed to our editorial board.
            We read every submission with care and will contact you with our decision.
          </p>
          <div className={styles.successMetaGrid}>
            <div className={styles.successMeta}>
              <span className={styles.successMetaLabel}>Submitted Work</span>
              <span className={styles.successMetaValue}>{form.title}</span>
            </div>
            <div className={styles.successMeta}>
              <span className={styles.successMetaLabel}>Contact</span>
              <span className={styles.successMetaValue}>{form.author_email}</span>
            </div>
            {uploadedFile && (
              <div className={styles.successMeta}>
                <span className={styles.successMetaLabel}>Attached File</span>
                <span className={styles.successMetaValue}>{uploadedFile.name}</span>
              </div>
            )}
          </div>
          <p className={styles.successNote}>
            Editorial response time is typically 4–6 weeks. We appreciate your patience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ─── Page Hero ─── */}
      <div className={styles.hero}>
        <div className={styles.heroDecor}>
          <Feather size={13} strokeWidth={1.5} />
          <span>Open Submissions</span>
        </div>
        <h1 className={styles.heroTitle}>Submit Your Work</h1>
        <p className={styles.heroDesc}>
          IBAR publishes essays, long-form criticism, and cultural commentary of exceptional depth.
          We welcome writers across disciplines and geographies — every submission is read by our board.
        </p>
        <div className={styles.guidelines}>
          <div className={styles.guideline}>
            <BookOpen size={15} strokeWidth={1.5} />
            <span>All forms of long-form writing welcome</span>
          </div>
          <div className={styles.guideline}>
            <FileText size={15} strokeWidth={1.5} />
            <span>Unpublished or limited-distribution work only</span>
          </div>
          <div className={styles.guideline}>
            <Mail size={15} strokeWidth={1.5} />
            <span>Urdu, English, and bilingual pieces welcome</span>
          </div>
        </div>
      </div>

      {/* ─── Form ─── */}
      <form onSubmit={handleSubmit} className={styles.form} noValidate>

        {/* ── Section 1: About You ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <User size={15} strokeWidth={1.5} />
            <span>About You</span>
          </div>

          <div className={styles.grid3}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="author_name">
                Full Name <span className={styles.required}>*</span>
              </label>
              <input
                id="author_name" name="author_name" type="text"
                className={styles.input}
                placeholder="Your full name"
                value={form.author_name}
                onChange={handleChange} required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="author_email">
                Email Address <span className={styles.required}>*</span>
              </label>
              <input
                id="author_email" name="author_email" type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={form.author_email}
                onChange={handleChange} required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="author_phone">
                Phone Number <span className={styles.optional}>(optional)</span>
              </label>
              <div className={styles.inputIcon}>
                <Phone size={14} strokeWidth={1.5} className={styles.inputIconEl} />
                <input
                  id="author_phone" name="author_phone" type="tel"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="+92 300 0000000"
                  value={form.author_phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="author_bio">
              Brief Bio <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="author_bio" name="author_bio"
              className={styles.textarea}
              placeholder="2–3 sentences about your background, affiliations, or current work…"
              value={form.author_bio}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        {/* ── Section 2: The Work ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <FileText size={15} strokeWidth={1.5} />
            <span>The Work</span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="title" name="title" type="text"
              className={styles.input}
              placeholder="The title of your piece"
              value={form.title}
              onChange={handleChange} required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="subtitle">
              Subtitle / Tagline <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id="subtitle" name="subtitle" type="text"
              className={styles.input}
              placeholder="A secondary title or thematic clarifier"
              value={form.subtitle}
              onChange={handleChange}
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="category">Category</label>
              <select id="category" name="category" className={styles.select}
                value={form.category} onChange={handleChange}>
                <option value="essay">Long-form Essay</option>
                <option value="criticism">Cultural Criticism</option>
                <option value="perspective">Personal Perspective</option>
                <option value="translation">Translation</option>
                <option value="poetry">Poetry</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="language">Language</label>
              <select id="language" name="language" className={styles.select}
                value={form.language} onChange={handleChange}>
                <option value="english">English</option>
                <option value="urdu">Urdu (اردو)</option>
                <option value="bilingual">Bilingual (Urdu / English)</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="abstract">
              Abstract / Summary <span className={styles.required}>*</span>
            </label>
            <textarea
              id="abstract" name="abstract"
              className={styles.textarea}
              placeholder="Briefly describe what your piece explores, argues, or illuminates. This is your editorial pitch (100–200 words)."
              value={form.abstract}
              onChange={handleChange}
              rows={4} required
            />
          </div>

          {/* ═══ Full Text Editor Panel ═══ */}
          <div className={`${styles.editorPanel} ${isFullscreen ? styles.editorFullscreen : ''}`}>

            {/* Editor Header */}
            <div className={styles.editorHeader}>
              <div className={styles.editorHeaderLeft}>
                <span className={styles.editorTitle}>
                  Full Text <span className={styles.required}>*</span>
                </span>
                <span className={styles.editorHint}>Markdown supported</span>
              </div>

              {/* Toolbar */}
              <div className={styles.toolbar}>
                <button type="button" className={styles.toolbarBtn} title="Bold (**text**)"
                  onClick={() => applyToolbarAction({ prefix: '**', suffix: '**' })}>
                  <Bold size={13} strokeWidth={2.5} />
                </button>
                <button type="button" className={styles.toolbarBtn} title="Italic (*text*)"
                  onClick={() => applyToolbarAction({ prefix: '*', suffix: '*' })}>
                  <Italic size={13} strokeWidth={2} />
                </button>
                <button type="button" className={styles.toolbarBtn} title="Heading (## Heading)"
                  onClick={() => applyToolbarAction({ linePrefix: '## ' })}>
                  <Heading2 size={13} strokeWidth={2} />
                </button>
                <button type="button" className={styles.toolbarBtn} title="Blockquote (> text)"
                  onClick={() => applyToolbarAction({ linePrefix: '> ' })}>
                  <Quote size={13} strokeWidth={2} />
                </button>
                <button type="button" className={styles.toolbarBtn} title="Bullet list (- item)"
                  onClick={() => applyToolbarAction({ linePrefix: '- ' })}>
                  <List size={13} strokeWidth={2} />
                </button>

                <div className={styles.toolbarDivider} />

                <button
                  type="button"
                  className={`${styles.toolbarBtn} ${rtlMode ? styles.toolbarBtnActive : ''}`}
                  title={rtlMode ? 'Switch to LTR' : 'Switch to RTL (Urdu)'}
                  onClick={() => setRtlMode(r => !r)}
                >
                  {rtlMode ? <AlignLeft size={13} strokeWidth={2} /> : <AlignRight size={13} strokeWidth={2} />}
                </button>

                <button
                  type="button"
                  className={`${styles.toolbarBtn} ${isPreview ? styles.toolbarBtnActive : ''}`}
                  title={isPreview ? 'Edit mode' : 'Preview'}
                  onClick={() => setIsPreview(p => !p)}
                >
                  {isPreview ? <EyeOff size={13} strokeWidth={2} /> : <Eye size={13} strokeWidth={2} />}
                </button>

                <button
                  type="button"
                  className={styles.toolbarBtn}
                  title={isFullscreen ? 'Exit focus mode' : 'Focus / Fullscreen'}
                  onClick={() => setIsFullscreen(f => !f)}
                >
                  {isFullscreen ? <Minimize2 size={13} strokeWidth={2} /> : <Maximize2 size={13} strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className={styles.editorBody}>
              {isPreview ? (
                <div
                  className={`${styles.editorPreview} ${rtlMode ? styles.editorRtl : ''}`}
                  dir={rtlMode ? 'rtl' : 'ltr'}
                  dangerouslySetInnerHTML={{ __html: `<p>${previewHtml}</p>` }}
                />
              ) : (
                <textarea
                  ref={contentRef}
                  id="content"
                  name="content"
                  className={`${styles.editorTextarea} ${rtlMode ? styles.editorRtl : ''}`}
                  placeholder={rtlMode
                    ? 'یہاں اپنا مضمون لکھیں یا چسپاں کریں…'
                    : 'Write or paste your full text here.\n\nMarkdown is supported:\n  ## Heading\n  **Bold text**\n  *Italic text*\n  > Blockquote\n  - Bullet item'}
                  value={form.content}
                  onChange={handleContentChange}
                  dir={rtlMode ? 'rtl' : 'ltr'}
                  lang={rtlMode ? 'ur' : 'en'}
                  spellCheck
                  required
                />
              )}
            </div>

            {/* Editor Footer: Stats */}
            <div className={styles.editorFooter}>
              <div className={styles.editorStats}>
                <span className={styles.editorStat}>
                  {words.toLocaleString()} words
                </span>
                <span className={styles.editorStat}>{chars.toLocaleString()} characters</span>
                <span className={styles.editorStat}>~{readTime} min read</span>
              </div>
              <div className={styles.editorMode}>
                {rtlMode && <span className={styles.rtlBadge}>RTL · اردو</span>}
                {isFullscreen && (
                  <button type="button" className={styles.exitFocus} onClick={() => setIsFullscreen(false)}>
                    <Minimize2 size={11} /> Exit Focus
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: File Upload ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Paperclip size={15} strokeWidth={1.5} />
            <span>Attach File <span className={styles.optional}>(optional)</span></span>
          </div>
          <p className={styles.uploadDesc}>
            You may attach a formatted document (PDF, Word, or plain text) in addition to the typed text above.
            Max size 10 MB.
          </p>

          <div
            className={styles.dropZone}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add(styles.dropZoneActive); }}
            onDragLeave={e => e.currentTarget.classList.remove(styles.dropZoneActive)}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.classList.remove(styles.dropZoneActive);
              const file = e.dataTransfer.files[0];
              if (file && fileInputRef.current) {
                const dt = new DataTransfer();
                dt.items.add(file);
                fileInputRef.current.files = dt.files;
                fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md"
              className={styles.fileInput}
              onChange={handleFileChange}
              aria-label="Attach manuscript file"
            />
            {uploadedFile ? (
              <div className={styles.fileAttached}>
                <FileText size={20} strokeWidth={1.5} />
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{uploadedFile.name}</span>
                  <span className={styles.fileSize}>{(uploadedFile.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  type="button"
                  className={styles.fileRemove}
                  onClick={e => { e.stopPropagation(); removeFile(); }}
                  aria-label="Remove attached file"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className={styles.dropZoneIdle}>
                <Paperclip size={22} strokeWidth={1.25} className={styles.dropZoneIcon} />
                <span className={styles.dropZoneText}>
                  Drag & drop a file, or <span className={styles.dropZoneLink}>browse</span>
                </span>
                <span className={styles.dropZoneFormats}>PDF · DOC · DOCX · TXT · MD</span>
              </div>
            )}
          </div>

          {uploadError && (
            <div className={styles.errorBanner} style={{ marginTop: '12px' }}>
              <AlertCircle size={15} strokeWidth={1.5} />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* ── Section 4: Notes ── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Send size={15} strokeWidth={1.5} />
            <span>Notes to Editors <span className={styles.optional}>(optional)</span></span>
          </div>
          <div className={styles.field}>
            <textarea
              id="notes" name="notes"
              className={styles.textarea}
              placeholder="Any context you'd like to share — prior publications, relevant references, or special considerations for the editorial team."
              value={form.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className={styles.errorBanner}>
            <AlertCircle size={15} strokeWidth={1.5} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Row */}
        <div className={styles.submitRow}>
          <p className={styles.terms}>
            By submitting, you confirm this is your original work and has not been published elsewhere
            in its current form. IBAR retains the right to edit for length and clarity before publication.
          </p>
          <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
            {status === 'loading' ? (
              <span className={styles.loadingDot} />
            ) : (
              <>
                <Send size={15} strokeWidth={2} />
                <span>Submit for Review</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Fullscreen backdrop overlay */}
      {isFullscreen && (
        <div className={styles.fullscreenBackdrop} onClick={() => setIsFullscreen(false)} />
      )}
    </div>
  );
}
