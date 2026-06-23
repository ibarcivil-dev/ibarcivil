import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import styles from './Markdown.module.css';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  // Simple check for Arabic/Urdu character ranges
  const isUrdu = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(content);

  return (
    <div 
      className={`${styles.markdown} ${isUrdu ? 'ur urdu' : ''}`}
      lang={isUrdu ? 'ur' : 'en'}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      <ReactMarkdown
        components={{
          img: ({ src, alt, title }) => {
            if (!src) return null;
            
            const srcStr = typeof src === 'string' ? src : '';
            // Allow using external placeholding or local files
            const isLocal = srcStr.startsWith('/');
            
            return (
              <figure style={{ margin: '3.5rem 0' }}>
                <div className={styles.imageContainer}>
                  {isLocal ? (
                    <Image
                      src={srcStr}
                      alt={alt || ''}
                      title={title || ''}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 65ch"
                    />
                  ) : (
                    // Fallback for absolute urls or placeholders
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={srcStr}
                      alt={alt || ''}
                      title={title || ''}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                {alt && <figcaption className={styles.imageCaption}>{alt}</figcaption>}
              </figure>
            );
          },
          // Custom override for link to ensure security and style
          a: ({ href, children }) => {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
