"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Force immediate scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto' // 'auto' bypasses smooth scroll which can get stuck
    });
  }, [pathname]);

  return null;
}
