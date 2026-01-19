'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/navigation.css';

interface NavigationProps {
  aboutLoaded?: boolean;
}

export default function Navigation({ aboutLoaded = true }: NavigationProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);

  function openMenu() {
    setIsOpen((prev) => !prev);
  }

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isHome || !aboutLoaded) return;

    const nav = document.querySelector('.navbar');
    const aboutSection = document.getElementById('about');
    if (!nav || !aboutSection) return;

    const handleScroll = () => {
      const rect = aboutSection.getBoundingClientRect();
      const winH = window.innerHeight;

      if (rect.bottom < winH * 0.1) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [aboutLoaded, isHome]);

  // Shrink navbar when not on home
  useEffect(() => {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    nav.classList.toggle('shrunk', !isHome);
    nav.classList.remove('hidden');
  }, [isHome]);

  return (
    <>
      {isOpen && <div className="menu-overlay" onClick={() => setIsOpen(false)} />}

      <nav className="navbar">
        <button className="menu-toggle" onClick={openMenu} aria-label="Toggle menu">
          {isOpen ? 'Menu ▲' : 'Menu ▼'}
        </button>

        <div className={`menu-list ${isOpen ? 'open' : ''}`}>
          <Link className="nav-link" href="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>

          <Link className="nav-link" href="/resume" onClick={() => setIsOpen(false)}>
            Resume
          </Link>

          <Link className="nav-link" href="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          <Link className="nav-link" href="/playground" onClick={() => setIsOpen(false)}>
            Playground
          </Link>
        </div>
      </nav>
    </>
  );
}
