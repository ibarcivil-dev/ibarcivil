"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  Sliders,
  ArrowLeft,
  Compass,
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> },
    { label: 'Articles', href: '/admin/articles', icon: <FileText size={16} /> },
    { label: 'Issues', href: '/admin/issues', icon: <Compass size={16} /> },
    { label: 'Authors', href: '/admin/authors', icon: <Users size={16} /> },
    { label: 'Homepage Curation', href: '/admin/homepage', icon: <Sliders size={16} /> },
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

        {/* Back Link */}
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Return to Site</span>
        </Link>
      </aside>

      {/* Main Panel Content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
