"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../admin.module.css';
import publicStyles from '@/app/(public)/article/[slug]/ArticlePage.module.css';
import { supabase } from '@/lib/supabaseClient';
import { 
  ArrowLeft, Eye, Edit3, Image as ImageIcon, Plus, X, HelpCircle,
  Heading1, Heading2, Heading3, Bold, Italic, Quote, List, ListOrdered, Link as LinkIcon, Code, Minus,
  ChevronDown, ChevronUp, Sliders, Save
} from 'lucide-react';
import { Markdown } from '@/components/Markdown';

export default function EditPerspective() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [articleId] = useState(id);
  
  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [issueId, setIssueId] = useState('');
  const [status, setStatus] = useState('draft');
  const [homepagePriority, setHomepagePriority] = useState(0);
  
  // Image State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');

  // Lists state
  const [authors, setAuthors] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  
  // Modals state
  const [showModal, setShowModal] = useState<'author' | 'topic' | 'issue' | null>(null);
  const [modalInput, setModalInput] = useState('');
  const [modalSpecialization, setModalSpecialization] = useState('');
  const [modalBio, setModalBio] = useState('');
  const [modalError, setModalError] = useState('');
  
  // UI state
  const [viewMode, setViewMode] = useState<'write' | 'preview'>('write');
  const [publishingDrawerOpen, setPublishingDrawerOpen] = useState(false);
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // Autosave states
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  
  // Slash commands autocomplete states
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuIndex, setSlashMenuIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const subtitleTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Markdown insert function
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const replacement = prefix + (selectedText || '') + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    
    setContent(newContent);
    setHasUnsavedChanges(true);

    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText || '').length
      );
    }, 0);
  };

  // Keyboard link prompting
  const handleInsertLink = () => {
    const url = prompt("Enter the URL:");
    if (url === null) return;
    const text = textareaRef.current ? textareaRef.current.value.substring(textareaRef.current.selectionStart, textareaRef.current.selectionEnd) : "";
    if (text) {
      insertMarkdown('[', `](${url})`);
    } else {
      const linkText = prompt("Enter link text:", "link description") || "link";
      insertMarkdown(`[${linkText}](${url})`);
    }
  };

  const handleInsertImage = () => {
    const url = prompt("Enter the image URL:");
    if (url === null) return;
    const alt = prompt("Enter image description (alt text):", "image description") || "";
    insertMarkdown(`![${alt}](${url})`);
  };

  // Slash commands list
  const slashCommands = useMemo(() => [
    { name: 'Heading 1', tag: '# ', desc: 'Large section heading' },
    { name: 'Heading 2', tag: '## ', desc: 'Medium section heading' },
    { name: 'Heading 3', tag: '### ', desc: 'Small section heading' },
    { name: 'Blockquote', tag: '> ', desc: 'Insert a quote block' },
    { name: 'Bullet List', tag: '- ', desc: 'Simple bulleted list' },
    { name: 'Numbered List', tag: '1. ', desc: 'Sequential numbered list' },
    { name: 'Insert Image', tag: 'image', desc: 'Add markdown image' },
    { name: 'Horizontal Rule', tag: '\n---\n', desc: 'Divider line' },
    { name: 'Code Block', tag: '\n```javascript\n\n```\n', desc: 'Code highlight container' }
  ], []);

  const filteredCommands = useMemo(() => {
    if (!showSlashMenu) return [];
    const textarea = textareaRef.current;
    if (!textarea) return slashCommands;
    const caretPos = textarea.selectionStart;
    const textBeforeCaret = content.substring(0, caretPos);
    const lastSlash = textBeforeCaret.lastIndexOf('/');
    if (lastSlash === -1) return slashCommands;
    
    const query = textBeforeCaret.substring(lastSlash + 1).toLowerCase();
    return slashCommands.filter(cmd => cmd.name.toLowerCase().includes(query));
  }, [showSlashMenu, content, slashCommands]);

  const executeSlashCommand = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const caretPos = textarea.selectionStart;
    const text = textarea.value;
    const textBeforeCaret = text.substring(0, caretPos);
    const lastSlash = textBeforeCaret.lastIndexOf('/');
    
    if (lastSlash === -1) return;
    
    const prefix = text.substring(0, lastSlash);
    const suffix = text.substring(caretPos);
    
    setShowSlashMenu(false);
    
    if (tag === 'image') {
      const url = prompt("Enter the image URL:");
      if (url === null) {
        setContent(prefix + suffix);
        return;
      }
      const alt = prompt("Enter image description (alt text):", "image description") || "";
      const inserted = `![${alt}](${url})`;
      setContent(prefix + inserted + suffix);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(lastSlash + inserted.length, lastSlash + inserted.length);
      }, 0);
    } else {
      const inserted = tag;
      setContent(prefix + inserted + suffix);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(lastSlash + inserted.length, lastSlash + inserted.length);
      }, 0);
    }
    setHasUnsavedChanges(true);
  };

  // Excerpt generator
  const generateExcerpt = (markdownContent: string) => {
    if (!markdownContent) return "";
    const paragraphs = markdownContent
      .split(/\r?\n\s*\r?\n/)
      .map(p => p.trim())
      .filter(p => p && !p.startsWith('#') && !p.startsWith('!') && !p.startsWith('>') && !p.startsWith('-') && !p.startsWith('1.'));
      
    if (paragraphs.length === 0) return "";
    
    const cleanText = paragraphs[0]
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[*_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
      
    return cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
  };

  // Slug derivation
  const slug = useMemo(() => {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
  }, [title]);

  // Reading calculations
  const readingMeta = useMemo(() => {
    const cleanText = content.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[.*?\]\(.*?\)/g, '').replace(/[#>*_~`]/g, '');
    const words = cleanText.split(/\s+/).filter(w => w.length > 0).length;
    const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
    const time = Math.ceil((words / 225) + (imageCount * 0.2));
    return { words, time, imageCount };
  }, [content]);

  // RTL Urdu detection
  const isRtl = useMemo(() => {
    return /[\u0600-\u06FF]/.test(title + ' ' + subtitle);
  }, [title, subtitle]);

  // Load perspective data and lists
  useEffect(() => {
    async function loadData() {
      try {
        const { data: authData } = await supabase.from('authors').select('*').order('name');
        const { data: topicData } = await supabase.from('topics').select('*').order('name');
        const { data: issData } = await supabase.from('issues').select('*').order('number', { ascending: false });

        if (authData) setAuthors(authData);
        if (topicData) setTopics(topicData);
        if (issData) setIssues(issData);

        if (articleId) {
          const { data, error } = await supabase.from('articles').select('*').eq('id', articleId).single();
          if (error) throw error;
          if (data) {
            setTitle(data.title);
            setSubtitle(data.subtitle);
            setExcerpt(data.excerpt || '');
            setContent(data.content);
            setAuthorId(data.author_id || '');
            setTopicId(data.topic_id || '');
            setIssueId(data.issue_id || '');
            setStatus(data.status);
            setHomepagePriority(data.homepage_priority);
            setCoverPreviewUrl(data.cover_url || '');
            
            setLastSavedTime(new Date());
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    }
    loadData();
  }, [articleId]);

  // Autosave effect (debounced 4s)
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const timer = setTimeout(() => {
      triggerSave();
    }, 4000);
    return () => clearTimeout(timer);
  }, [content, title, subtitle, hasUnsavedChanges]);

  // Page Exit Guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Escape Focus Mode inside event listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFocusMode) {
          setIsFocusMode(false);
        }
        if (showSlashMenu) {
          setShowSlashMenu(false);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isFocusMode, showSlashMenu]);

  // Image Optimization
  const handleImageOptimization = async (file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp)/)) {
      alert('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    setCoverFile(file);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const MAX_WIDTH = 1920;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('No canvas context');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setCoverBlob(blob);
                setCoverPreviewUrl(url);
                setHasUnsavedChanges(true);
              }
            },
            'image/webp',
            0.85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setCoverBlob(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
      setHasUnsavedChanges(true);
    }
  };

  const uploadImageToSupabase = async (blob: Blob, path: string): Promise<string> => {
    try {
      const { data, error } = await supabase.storage.from('articles').upload(path, blob, {
        upsert: true,
        contentType: blob.type
      });
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage.from('articles').getPublicUrl(path);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.warn('Storage upload failed, fallback to local URL', err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(blob);
      });
    }
  };

  // Unified save engine
  const triggerSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      let finalCoverUrl = coverPreviewUrl;
      
      if (coverBlob) {
        const ext = coverBlob.type === 'image/webp' ? 'webp' : coverFile?.name.split('.').pop() || 'jpg';
        const path = `articles/${articleId}/cover.${ext}`;
        finalCoverUrl = await uploadImageToSupabase(coverBlob, path);
      }

      const generatedExcerpt = generateExcerpt(content);

      const dbPayload = {
        title,
        slug,
        subtitle,
        excerpt: generatedExcerpt || excerpt || '',
        content,
        author_id: authorId || null,
        topic_id: topicId || null,
        issue_id: issueId || null,
        status,
        featured: false,
        homepage_priority: homepagePriority,
        reading_time: readingMeta.time,
        cover_url: finalCoverUrl || null,
        cover_alt_text: null,
        cover_caption: null,
        is_perspective: true,
        published_at: status === 'published' ? new Date().toISOString() : null
      };

      const { error } = await supabase.from('articles').update(dbPayload).eq('id', articleId);
      if (error) throw error;

      setHasUnsavedChanges(false);
      setLastSavedTime(new Date());
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerSave();
    setPublishingDrawerOpen(false);
    router.push('/admin/perspectives');
    router.refresh();
  };

  const handleBack = async () => {
    if (hasUnsavedChanges) {
      if (window.confirm("Save changes before leaving?")) {
        await triggerSave();
      }
    }
    router.push('/admin/perspectives');
  };

  const handleCreateEntity = async () => {
    setModalError('');
    const name = modalInput.trim();
    if (!name) return;
    
    try {
      if (showModal === 'author') {
        const newSlug = name.replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-').toLowerCase();
        const newAuthor = { name, slug: newSlug, bio: modalBio.trim(), specialization: modalSpecialization.trim(), avatar_url: '' };
        const { data, error } = await supabase.from('authors').insert([newAuthor]).select();
        if (error) throw error;
        if (data) {
          setAuthors([...authors, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
          setAuthorId(data[0].id);
        }
      } else if (showModal === 'topic') {
        const newSlug = name.replace(/[^a-z0-9\s-]/gi, '').trim().replace(/\s+/g, '-').toLowerCase();
        const newTopic = { name, slug: newSlug, description: '' };
        const { data, error } = await supabase.from('topics').insert([newTopic]).select();
        if (error) throw error;
        if (data) {
          setTopics([...topics, data[0]].sort((a, b) => a.name.localeCompare(b.name)));
          setTopicId(data[0].id);
        }
      } else if (showModal === 'issue') {
        const number = issues.length > 0 ? Math.max(...issues.map(i => i.number)) + 1 : 1;
        const newIssue = { number, title: name, description: '', theme: '', cover_url: '', editor_note: '' };
        const { data, error } = await supabase.from('issues').insert([newIssue]).select();
        if (error) throw error;
        if (data) {
          setIssues([data[0], ...issues].sort((a, b) => b.number - a.number));
          setIssueId(data[0].id);
        }
      }
      setShowModal(null);
      setModalInput('');
      setModalSpecialization('');
      setModalBio('');
    } catch (err: any) {
      setModalError(err.message || 'An error occurred.');
    }
  };

  // Auto-resize inputs
  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  useEffect(() => {
    autoResize(titleTextareaRef.current);
  }, [title]);

  useEffect(() => {
    autoResize(subtitleTextareaRef.current);
  }, [subtitle]);

  // Input Change trigger slash commands
  const handleContentChange = (val: string) => {
    setContent(val);
    setHasUnsavedChanges(true);
    
    const textarea = textareaRef.current;
    if (textarea) {
      const caretPos = textarea.selectionStart;
      const textBeforeCaret = val.substring(0, caretPos);
      
      if (textBeforeCaret.endsWith('/')) {
        setShowSlashMenu(true);
        setSlashMenuIndex(0);
      } else {
        const lastSlash = textBeforeCaret.lastIndexOf('/');
        if (lastSlash === -1 || textBeforeCaret.substring(lastSlash).includes(' ')) {
          setShowSlashMenu(false);
        }
      }
    }
  };

  // Input KeyDown shortcuts & commands
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlashMenu && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSlashMenuIndex(prev => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSlashMenuIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSlashCommand(filteredCommands[slashMenuIndex].tag);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSlashMenu(false);
        return;
      }
    }

    if (e.ctrlKey) {
      if (e.key === 'b') {
        e.preventDefault();
        insertMarkdown('**', '**');
      } else if (e.key === 'i') {
        e.preventDefault();
        insertMarkdown('*', '*');
      } else if (e.key === 'k') {
        e.preventDefault();
        handleInsertLink();
      } else if (e.shiftKey && (e.code === 'Digit7' || e.key === '7')) {
        e.preventDefault();
        insertMarkdown('1. ');
      } else if (e.shiftKey && (e.code === 'Digit8' || e.key === '8')) {
        e.preventDefault();
        insertMarkdown('- ');
      } else if (e.shiftKey && e.code === 'KeyF') {
        e.preventDefault();
        setIsFocusMode(!isFocusMode);
      }
    }
  };

  // Format last saved time
  const formattedSavedTime = useMemo(() => {
    if (!lastSavedTime) return '';
    return lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [lastSavedTime]);

  const author = useMemo(() => authors.find(a => a.id === authorId), [authors, authorId]);
  const topic = useMemo(() => topics.find(t => t.id === topicId), [topics, topicId]);
  const issue = useMemo(() => issues.find(i => i.id === issueId), [issues, issueId]);

  // Drawer Style
  const drawerStyle = useMemo<React.CSSProperties>(() => ({
    position: 'fixed',
    top: 0,
    right: 0,
    width: '420px',
    height: '100vh',
    backgroundColor: 'var(--surface)',
    borderLeft: '1px solid var(--border)',
    boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
    zIndex: 10000,
    transform: publishingDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '32px 24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }), [publishingDrawerOpen]);

  // Backdrop Style
  const backdropStyle = useMemo<React.CSSProperties>(() => ({
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(2px)',
    zIndex: 9999,
    opacity: publishingDrawerOpen ? 1 : 0,
    pointerEvents: publishingDrawerOpen ? 'auto' : 'none',
    transition: 'opacity 0.3s ease'
  }), [publishingDrawerOpen]);

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <style>{`
        .toolbar-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--text-secondary);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .toolbar-btn:hover {
          color: var(--text-primary);
          background-color: var(--border);
        }
        .mode-btn {
          background: none;
          border: none;
          padding: 6px 16px;
          cursor: pointer;
          font-size: 0.8rem;
          font-family: var(--font-sans);
          font-weight: 500;
          display: flex;
          align-items: center;
          transition: all 0.2s;
          border-radius: 4px;
        }
        .mode-btn:hover {
          background-color: var(--muted);
        }
      `}</style>

      {/* 1. Header */}
      {!isFocusMode && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 40px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* Left: Back Link */}
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              padding: 0
            }}
          >
            <ArrowLeft size={16} />
            <span>Perspectives</span>
          </button>

          {/* Center/Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Write | Preview Switcher */}
            <div style={{ display: 'flex', gap: '4px', border: '1px solid var(--border)', padding: '2px', borderRadius: '6px', backgroundColor: 'var(--background)' }}>
              <button
                type="button"
                onClick={() => setViewMode('write')}
                className="mode-btn"
                style={{
                  backgroundColor: viewMode === 'write' ? 'var(--surface)' : 'transparent',
                  color: viewMode === 'write' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: viewMode === 'write' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className="mode-btn"
                style={{
                  backgroundColor: viewMode === 'preview' ? 'var(--surface)' : 'transparent',
                  color: viewMode === 'preview' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: viewMode === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Preview
              </button>
            </div>

            {/* Autosave status text */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '110px', textAlign: 'right' }}>
              {isSaving ? (
                <span style={{ color: 'var(--accent)' }}>Saving...</span>
              ) : hasUnsavedChanges ? (
                <span style={{ fontStyle: 'italic' }}>Unsaved changes</span>
              ) : lastSavedTime ? (
                <span>Saved at {formattedSavedTime}</span>
              ) : (
                <span style={{ opacity: 0.5 }}>Not saved yet</span>
              )}
            </div>

            {/* Settings Button opens the drawer */}
            <button
              onClick={() => setPublishingDrawerOpen(true)}
              className={styles.btnPrimary}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0,
                padding: '8px 16px',
                borderRadius: '4px',
                textTransform: 'none',
                letterSpacing: 'normal'
              }}
            >
              <Sliders size={16} />
              <span>Perspective Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Workspace Layout */}
      <div 
        style={isFocusMode ? {
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--background)',
          zIndex: 99999,
          overflowY: 'auto',
          padding: '60px 24px 40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        } : {
          padding: '60px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {isFocusMode && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
            opacity: 0.6
          }}>
            Press <kbd style={{ background: 'var(--muted)', padding: '2px 6px', border: '1px solid var(--border)', borderRadius: '3px' }}>Esc</kbd> to exit focus mode
          </div>
        )}

        <div style={{ width: '100%', maxWidth: '780px', display: 'flex', flexDirection: 'column' }}>
          {viewMode === 'write' ? (
            <>
              {/* Title Input */}
              <textarea
                ref={titleTextareaRef}
                placeholder="Title..."
                value={title}
                onChange={e => { setTitle(e.target.value); setHasUnsavedChanges(true); }}
                onBlur={triggerSave}
                required
                rows={1}
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  resize: 'none',
                  padding: '8px 0',
                  lineHeight: '1.15',
                  textAlign: isRtl ? 'right' : 'left'
                }}
              />

              {/* Subtitle Input */}
              <textarea
                ref={subtitleTextareaRef}
                placeholder="Subtitle or brief thesis statement..."
                value={subtitle}
                onChange={e => { setSubtitle(e.target.value); setHasUnsavedChanges(true); }}
                onBlur={triggerSave}
                required
                rows={1}
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: 'var(--text-secondary)',
                  resize: 'none',
                  padding: '8px 0',
                  lineHeight: '1.45',
                  marginBottom: '24px',
                  textAlign: isRtl ? 'right' : 'left'
                }}
              />

              {/* Formatting Toolbar */}
              {!isFocusMode && (
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  flexWrap: 'wrap',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '6px',
                  marginBottom: '20px',
                  position: 'sticky',
                  top: '80px',
                  zIndex: 50
                }}>
                  <button type="button" title="Heading 1" onClick={() => insertMarkdown('# ')} className="toolbar-btn"><Heading1 size={16} /></button>
                  <button type="button" title="Heading 2" onClick={() => insertMarkdown('## ')} className="toolbar-btn"><Heading2 size={16} /></button>
                  <button type="button" title="Heading 3" onClick={() => insertMarkdown('### ')} className="toolbar-btn"><Heading3 size={16} /></button>
                  <span style={{ width: '1px', backgroundColor: 'var(--border)', margin: '4px 6px' }} />
                  <button type="button" title="Bold (Ctrl+B)" onClick={() => insertMarkdown('**', '**')} className="toolbar-btn"><Bold size={16} /></button>
                  <button type="button" title="Italic (Ctrl+I)" onClick={() => insertMarkdown('*', '*')} className="toolbar-btn"><Italic size={16} /></button>
                  <span style={{ width: '1px', backgroundColor: 'var(--border)', margin: '4px 6px' }} />
                  <button type="button" title="Blockquote" onClick={() => insertMarkdown('> ')} className="toolbar-btn"><Quote size={16} /></button>
                  <button type="button" title="Bullet List (Ctrl+Shift+8)" onClick={() => insertMarkdown('- ')} className="toolbar-btn"><List size={16} /></button>
                  <button type="button" title="Numbered List (Ctrl+Shift+7)" onClick={() => insertMarkdown('1. ')} className="toolbar-btn"><ListOrdered size={16} /></button>
                  <span style={{ width: '1px', backgroundColor: 'var(--border)', margin: '4px 6px' }} />
                  <button type="button" title="Insert Link (Ctrl+K)" onClick={handleInsertLink} className="toolbar-btn"><LinkIcon size={16} /></button>
                  <button type="button" title="Insert Image" onClick={handleInsertImage} className="toolbar-btn"><ImageIcon size={16} /></button>
                  <button type="button" title="Code Block" onClick={() => insertMarkdown('\n```javascript\n', '\n```\n')} className="toolbar-btn"><Code size={16} /></button>
                  <button type="button" title="Divider" onClick={() => insertMarkdown('\n---\n')} className="toolbar-btn"><Minus size={16} /></button>
                </div>
              )}

              {/* Main Writing Field */}
              <textarea
                ref={textareaRef}
                required
                placeholder="Start writing in markdown..."
                value={content}
                onChange={e => handleContentChange(e.target.value)}
                onBlur={triggerSave}
                onKeyDown={handleEditorKeyDown}
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{
                  width: '100%',
                  minHeight: '500px',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.15rem',
                  lineHeight: '1.8',
                  resize: 'none',
                  paddingBottom: '35vh',
                  textAlign: isRtl ? 'right' : 'left'
                }}
              />

              {/* Slash commands popup menu */}
              {showSlashMenu && filteredCommands.length > 0 && (
                <div style={{
                  position: 'fixed',
                  bottom: '80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '320px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                  zIndex: 999999,
                  overflow: 'hidden',
                  fontFamily: 'var(--font-sans)'
                }}>
                  <div style={{ padding: '8px 12px', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--muted)' }}>
                    Formatting Commands
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {filteredCommands.map((cmd, idx) => (
                      <div
                        key={cmd.name}
                        onClick={() => executeSlashCommand(cmd.tag)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          backgroundColor: idx === slashMenuIndex ? 'var(--muted)' : 'transparent',
                          borderBottom: '1px solid var(--border)'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cmd.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{cmd.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Metadata Bar */}
              {!isFocusMode && (
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '16px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-sans)',
                  marginTop: '16px'
                }}>
                  <span>Words: <strong>{readingMeta.words}</strong></span>
                  <span>•</span>
                  <span>Read Time: <strong>{readingMeta.time} min</strong></span>
                  <span>•</span>
                  {lastSavedTime ? (
                    <span>Saved: <strong>{formattedSavedTime}</strong></span>
                  ) : (
                    <span>Unsaved</span>
                  )}
                  <span>•</span>
                  <span>Slug: <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{slug || 'will-be-auto-generated'}</strong></span>
                </div>
              )}
            </>
          ) : (
            /* 9. Preview Mode */
            <div className={publicStyles.articleWrapper} style={{ width: '100%', padding: '0 16px' }}>
              <div className={`${publicStyles.header} ${isRtl ? 'ur urdu' : ''}`} lang={isRtl ? 'ur' : 'en'} dir={isRtl ? 'rtl' : 'ltr'} style={{ textAlign: 'center', marginBottom: '48px' }}>
                {topic && (
                  <span className={publicStyles.topic} style={{ display: 'block', marginBottom: '16px' }}>
                    {topic.name}
                  </span>
                )}
                <h1 className={publicStyles.title} style={{ fontSize: '3.5rem', lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: '20px' }}>
                  {title || 'Untranslated Title'}
                </h1>
                <p className={publicStyles.subtitle} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: 300, maxWidth: '60ch', margin: '0 auto 32px' }}>
                  {subtitle || 'Subtitle statement...'}
                </p>

                <div className={publicStyles.meta} style={{ display: 'flex', justifyContent: 'center', gap: '16px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <span>
                    By <strong style={{ color: 'var(--text-primary)' }}>{author?.name || 'Author'}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {new Date().toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {issue && (
                    <>
                      <span>•</span>
                      <span>
                        In <strong>Issue No. {issue.number}</strong>
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span>{readingMeta.time} min read</span>
                </div>
              </div>

              {coverPreviewUrl && (
                <div className={publicStyles.coverContainer} style={{ position: 'relative', width: '100%', height: '480px', marginBottom: '64px', backgroundColor: 'var(--muted)' }}>
                  <img
                    src={coverPreviewUrl}
                    alt={title}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
              )}

              <div style={{ marginTop: '40px' }}>
                {content ? (
                  <Markdown content={content} />
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
                    No perspective content written yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Publishing Drawer */}
      <div 
        onClick={() => setPublishingDrawerOpen(false)}
        style={backdropStyle} 
      />
      <div style={drawerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 500 }}>Perspective Settings</h2>
          <button 
            type="button" 
            onClick={() => setPublishingDrawerOpen(false)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
          {/* Cover Image Media Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className={styles.label}>Cover Image</label>
            {coverPreviewUrl ? (
              <div style={{ border: '1px solid var(--border)', padding: '12px', backgroundColor: 'var(--background)', borderRadius: '4px' }}>
                <img 
                  src={coverPreviewUrl} 
                  alt="Cover Preview" 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '2px', backgroundColor: 'var(--muted)' }} 
                />
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('cover-file-input-drawer')?.click()}
                    style={{ fontSize: '0.8rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                  >
                    Replace Image
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setCoverFile(null); setCoverBlob(null); setCoverPreviewUrl(''); setHasUnsavedChanges(true); }}
                    style={{ fontSize: '0.8rem', color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => document.getElementById('cover-file-input-drawer')?.click()}
                style={{
                  border: '1px dashed var(--border)',
                  borderRadius: '6px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--background)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'border-color 0.2s'
                }}
              >
                <ImageIcon size={28} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Upload Image</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Recommended size: 1600×900+</span>
              </div>
            )}
            <input
              id="cover-file-input-drawer"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageOptimization(file);
              }}
              style={{ display: 'none' }}
            />
          </div>

          {/* Author Selector */}
          <div className={styles.formGroupFull} style={{ margin: 0 }}>
            <label className={styles.label}>Author</label>
            <select
              className={styles.select}
              value={authorId}
              onChange={e => {
                if (e.target.value === 'ADD_NEW') setShowModal('author');
                else { setAuthorId(e.target.value); setHasUnsavedChanges(true); }
              }}
              required
            >
              <option value="" disabled>Select an author</option>
              {authors.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
              <option value="ADD_NEW">+ Create New Author...</option>
            </select>
          </div>

          {/* Topic Selector */}
          <div className={styles.formGroupFull} style={{ margin: 0 }}>
            <label className={styles.label}>Topic</label>
            <select
              className={styles.select}
              value={topicId}
              onChange={e => {
                if (e.target.value === 'ADD_NEW') setShowModal('topic');
                else { setTopicId(e.target.value); setHasUnsavedChanges(true); }
              }}
            >
              <option value="">None</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
              <option value="ADD_NEW">+ Create New Topic...</option>
            </select>
          </div>

          {/* Status Selector */}
          <div className={styles.formGroupFull} style={{ margin: 0 }}>
            <label className={styles.label}>Publish Status</label>
            <select
              className={styles.select}
              value={status}
              onChange={e => { setStatus(e.target.value); setHasUnsavedChanges(true); }}
            >
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Collapsible Advanced Options Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button 
              type="button" 
              onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                background: 'none',
                border: 'none',
                borderTop: '1px solid var(--border)',
                padding: '16px 0 8px 0',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-secondary)'
              }}
            >
              <span>Advanced Options</span>
              {advancedOptionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {advancedOptionsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '12px' }}>
                {/* Magazine Issue */}
                <div className={styles.formGroupFull} style={{ margin: 0 }}>
                  <label className={styles.label}>Magazine Issue</label>
                  <select
                    className={styles.select}
                    value={issueId}
                    onChange={e => {
                      if (e.target.value === 'ADD_NEW') setShowModal('issue');
                      else { setIssueId(e.target.value); setHasUnsavedChanges(true); }
                    }}
                  >
                    <option value="">None</option>
                    {issues.map(iss => (
                      <option key={iss.id} value={iss.id}>Issue No. {iss.number}: {iss.title}</option>
                    ))}
                    <option value="ADD_NEW">+ Create New Issue...</option>
                  </select>
                </div>

                {/* Priority Score */}
                <div className={styles.formGroupFull} style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <label className={styles.label} style={{ margin: 0 }}>Priority Score</label>
                    <div title="Higher numbers appear first on the homepage. Default is 0.">
                      <HelpCircle size={14} color="var(--text-secondary)" style={{ cursor: 'help' }} />
                    </div>
                  </div>
                  <input
                    type="number"
                    className={styles.input}
                    value={homepagePriority}
                    onChange={e => { setHomepagePriority(parseInt(e.target.value) || 0); setHasUnsavedChanges(true); }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className={styles.btnPrimary}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: 'auto 0 0 0',
              padding: '12px 24px',
              borderRadius: '4px'
            }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* Entity Creation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '32px',
            width: '100%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 500 }}>
                Create New {showModal === 'author' ? 'Author' : showModal === 'topic' ? 'Topic' : 'Issue'}
              </h3>
              <button 
                onClick={() => { setShowModal(null); setModalInput(''); setModalSpecialization(''); setModalBio(''); setModalError(''); }} 
                style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-primary)' }}
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div style={{ color: 'red', fontSize: '0.85rem' }}>{modalError}</div>
            )}

            <div className={styles.formGroupFull} style={{ margin: 0 }}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                className={styles.input}
                value={modalInput}
                onChange={e => setModalInput(e.target.value)}
                placeholder={`Enter ${showModal} name...`}
                autoFocus
              />
            </div>

            {showModal === 'author' && (
              <>
                <div className={styles.formGroupFull} style={{ margin: 0 }}>
                  <label className={styles.label}>Specialization (Optional)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={modalSpecialization}
                    onChange={e => setModalSpecialization(e.target.value)}
                    placeholder="e.g. Critical Theory, Technology"
                  />
                </div>
                <div className={styles.formGroupFull} style={{ margin: 0 }}>
                  <label className={styles.label}>Bio (Optional)</label>
                  <textarea
                    className={styles.textarea}
                    style={{ minHeight: '80px' }}
                    value={modalBio}
                    onChange={e => setModalBio(e.target.value)}
                    placeholder="Short biography..."
                  />
                </div>
              </>
            )}

            <button
              onClick={handleCreateEntity}
              className={styles.btnPrimary}
              style={{ width: '100%', marginTop: '10px', borderRadius: '4px' }}
            >
              Save {showModal === 'author' ? 'Author' : showModal === 'topic' ? 'Topic' : 'Issue'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
