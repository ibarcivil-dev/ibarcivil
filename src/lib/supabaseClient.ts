import { createClient } from '@supabase/supabase-js';
import * as mockDb from './mockDb';

const hasEnv =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-anon-key';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Helper to initialize local data in localStorage or memory
const getLocalData = (key: string, defaultVal: any) => {
  if (typeof window === 'undefined') return defaultVal;
  const stored = localStorage.getItem(`ibar_mock_${key}`);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return defaultVal; }
  }
  localStorage.setItem(`ibar_mock_${key}`, JSON.stringify(defaultVal));
  return defaultVal;
};

const setLocalData = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`ibar_mock_${key}`, JSON.stringify(data));
  }
};

// Define mock tables
const getInitialTables = () => {
  // Map mockDb camelCase properties to SQL snake_case keys
  const articles = mockDb.MOCK_ARTICLES.map(a => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    subtitle: a.subtitle,
    excerpt: a.excerpt,
    content: a.content,
    cover_url: a.coverUrl,
    cover_alt_text: a.coverAltText || null,
    cover_caption: a.coverCaption || null,
    author_id: a.authorId,
    issue_id: a.issueId || null,
    topic_id: a.topicId || null,
    status: a.status,
    featured: a.featured,
    homepage_priority: a.homepagePriority,
    reading_time: a.readingTime,
    published_at: a.publishedAt,
    is_perspective: a.isPerspective || false,
    created_at: a.publishedAt || new Date().toISOString()
  }));

  const authors = mockDb.MOCK_AUTHORS.map(a => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    avatar_url: a.avatarUrl,
    bio: a.bio,
    specialization: a.specialization,
    current_interests: a.currentInterests || [],
    recommended_reading: a.recommendedReading || [],
    created_at: new Date().toISOString()
  }));

  const issues = mockDb.MOCK_ISSUES.map(i => ({
    id: i.id,
    number: i.number,
    title: i.title,
    description: i.description,
    cover_url: i.coverUrl,
    theme: i.theme,
    editor_note: i.editorNote,
    published_at: i.publishedAt,
    created_at: i.publishedAt || new Date().toISOString()
  }));

  const topics = mockDb.MOCK_TOPICS.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
    created_at: new Date().toISOString()
  }));

  const homepage_configs = [{
    id: 'config-1',
    hero_article_id: mockDb.MOCK_HOMEPAGE_CONFIG.heroArticleId,
    featured_essay_ids: mockDb.MOCK_HOMEPAGE_CONFIG.featuredEssayIds,
    issue_spotlight_id: mockDb.MOCK_HOMEPAGE_CONFIG.issueSpotlightId,
    archive_highlight_id: mockDb.MOCK_HOMEPAGE_CONFIG.archiveHighlightId,
    editors_note_id: mockDb.MOCK_HOMEPAGE_CONFIG.editorsNoteId,
    updated_at: new Date().toISOString()
  }];

  const editor_notes = mockDb.MOCK_EDITOR_NOTES.map(n => ({
    id: n.id,
    title: n.title,
    content: n.content,
    published_at: n.publishedAt,
    created_at: n.publishedAt || new Date().toISOString()
  }));

  const site_settings = [{
    id: 'settings-1',
    twitter_url: 'https://twitter.com/ibar',
    github_url: 'https://github.com/ibar',
    instagram_url: 'https://instagram.com/ibar',
    phone_number: '+1 (555) 019-2834',
    contact_email: 'editorial@ibar.com',
    footer_copyright: '© 2026 IBAR. All rights reserved.',
    updated_at: new Date().toISOString()
  }];

  return {
    articles,
    authors,
    issues,
    topics,
    homepage_configs,
    editor_notes,
    site_settings,
    newsletter_subscribers: [] as any[],
    submissions: [] as any[]
  };
};

class MockQueryBuilder {
  private tableName: string;
  private data: any;

  constructor(tableName: string) {
    this.tableName = tableName;
    const initial = getInitialTables();
    const allData = getLocalData('tables', initial);
    this.data = allData[tableName] || [];
  }

  private updateAllData(newData: any[]) {
    const initial = getInitialTables();
    const allData = getLocalData('tables', initial);
    allData[this.tableName] = newData;
    setLocalData('tables', allData);
    this.data = newData;
  }

  select(columns: string = '*', options?: { count?: string; head?: boolean }) {
    let result = [...this.data];

    // If count: 'exact' and head: true is requested, return count immediately
    if (options?.count === 'exact' && options?.head) {
      return Promise.resolve({ data: null, error: null, count: result.length }) as any;
    }

    const builder: any = {
      eq: (column: string, value: any) => {
        result = result.filter(item => item[column] === value);
        return builder;
      },
      order: (column: string, orderOpts?: { ascending?: boolean }) => {
        const asc = orderOpts?.ascending !== false;
        result.sort((a: any, b: any) => {
          const valA = a[column];
          const valB = b[column];
          if (valA < valB) return asc ? -1 : 1;
          if (valA > valB) return asc ? 1 : -1;
          return 0;
        });
        return builder;
      },
      then: (resolve: any) => {
        resolve({ data: result, error: null, count: result.length });
      }
    };

    return builder;
  }

  insert(rows: any[]) {
    const newRows = rows.map(r => ({
      id: r.id || `${this.tableName.substring(0, 3)}-mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      ...r
    }));
    const updated = [...this.data, ...newRows];
    this.updateAllData(updated);

    return {
      select: () => Promise.resolve({ data: newRows, error: null }),
      then: (resolve: any) => resolve({ data: newRows, error: null })
    };
  }

  update(values: any) {
    let targetId: any = null;

    const chain = {
      eq: (column: string, value: any) => {
        if (column === 'id') {
          targetId = value;
        }
        const updated = this.data.map((item: any) => {
          if (item.id === targetId || (column !== 'id' && item[column] === value)) {
            return { ...item, ...values };
          }
          return item;
        });
        this.updateAllData(updated);
        return Promise.resolve({ data: updated.filter((item: any) => item.id === targetId), error: null });
      },
      then: (resolve: any) => resolve({ data: [], error: null })
    };

    return chain;
  }

  delete() {
    let targetId: any = null;

    const chain = {
      eq: (column: string, value: any) => {
        if (column === 'id') {
          targetId = value;
        }
        const updated = this.data.filter((item: any) => {
          if (item.id === targetId || (column !== 'id' && item[column] === value)) {
            return false;
          }
          return true;
        });
        this.updateAllData(updated);
        return Promise.resolve({ data: null, error: null });
      },
      then: (resolve: any) => resolve({ data: null, error: null })
    };

    return chain;
  }
}

const mockSupabase = {
  from: (tableName: string) => new MockQueryBuilder(tableName),
  auth: {
    getSession: () => Promise.resolve({ 
      data: { 
        session: (typeof window !== 'undefined' && localStorage.getItem('ibar_mock_session')) 
          ? { user: { email: 'admin@ibar.com' } } 
          : null 
      }, 
      error: null 
    }),
    signInWithPassword: ({ email, password }: any) => {
      if (email === 'admin@ibar.com' && password === 'admin123') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('ibar_mock_session', 'true');
        }
        return Promise.resolve({ data: { user: { email }, session: {} }, error: null });
      }
      return Promise.resolve({ 
        data: { user: null, session: null }, 
        error: { message: 'Invalid credentials. Use admin@ibar.com / admin123 for testing.' } 
      });
    },
    signOut: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ibar_mock_session');
      }
      return Promise.resolve({ error: null });
    }
  }
} as any;

if (!hasEnv) {
  console.warn('Supabase URL or Anon Key is missing in environment variables. Falling back to client-side localStorage mock client.');
}

export const supabase = hasEnv
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;

