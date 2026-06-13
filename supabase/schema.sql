-- IBAR Database Schema
-- Focus: Premium digital publication workflow

-- Create Article Status Enum
CREATE TYPE article_status AS ENUM ('draft', 'review', 'scheduled', 'published', 'archived');

-- 1. Authors Table
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    bio TEXT NOT NULL,
    specialization TEXT NOT NULL,
    current_interests TEXT[] DEFAULT '{}',
    recommended_reading JSONB DEFAULT '[]', -- array of recommended items with titles and urls
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Issues Table
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT,
    theme TEXT NOT NULL,
    editor_note TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 3. Topics Table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 4. Articles Table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL, -- Markdown content
    cover_url TEXT,
    author_id UUID REFERENCES authors(id) ON DELETE RESTRICT NOT NULL,
    issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
    status article_status DEFAULT 'draft' NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    homepage_priority INTEGER DEFAULT 0 NOT NULL,
    reading_time INTEGER NOT NULL DEFAULT 5, -- in minutes
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 5. Collections Table
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    cover_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 6. Collection Articles (Many-to-Many mapping with order)
CREATE TABLE collection_articles (
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    PRIMARY KEY (collection_id, article_id)
);

-- 7. Editor Notes Table (Editor's Notebook)
CREATE TABLE editor_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Short markdown notes
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 8. Recommendations Table (Reading List)
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    curator_name TEXT NOT NULL,
    commentary TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 9. Homepage Configurations Table (Singleton layout management)
CREATE TABLE homepage_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    featured_essay_ids UUID[] DEFAULT '{}', -- Ordered list of article IDs
    issue_spotlight_id UUID REFERENCES issues(id) ON DELETE SET NULL,
    archive_highlight_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    editors_note_id UUID REFERENCES editor_notes(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 10. Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for optimized querying
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status_pub ON articles(status) WHERE status = 'published';
CREATE INDEX idx_authors_slug ON authors(slug);
CREATE INDEX idx_topics_slug ON topics(slug);
CREATE INDEX idx_issues_number ON issues(number);
CREATE INDEX idx_collections_slug ON collections(slug);
