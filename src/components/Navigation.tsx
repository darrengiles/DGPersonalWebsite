'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavigationProps {
  aboutLoaded?: boolean;
}

export default function Navigation({ aboutLoaded = true }: NavigationProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isShrunk, setIsShrunk] = useState(!isHome);

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

  // Hide navbar when scrolled past about section on home page
  useEffect(() => {
    if (!isHome || !aboutLoaded) return;

    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const handleScroll = () => {
      const rect = aboutSection.getBoundingClientRect();
      const winH = window.innerHeight;

      setIsHidden(rect.bottom < winH * 0.1);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [aboutLoaded, isHome]);

  // Shrink navbar when not on home
  useEffect(() => {
    setIsShrunk(!isHome);
    setIsHidden(false);
  }, [isHome]);

  return (
    <>
      {isOpen && (
        <div
          className="hidden max-[700px]:block fixed inset-0 bg-black/60 z-[1000] animate-[fadeIn_0.2s_ease]"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav
        className={clsx(
          'fixed top-6 left-1/2 -translate-x-1/2 z-[1000] inline-flex items-center justify-center gap-0 py-3 px-7 rounded-full bg-[var(--bg-navbar)] backdrop-blur-[10px] shadow-[0_4px_20px_var(--card-shadow)] transition-[transform,padding,width,background-color,box-shadow,opacity,visibility] duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          isShrunk && 'bg-[var(--bg-navbar-scrolled)] shadow-[0_2px_12px_var(--card-shadow-hover)]',
          isHidden && 'opacity-0 invisible pointer-events-none',
          // Mobile: restyle as just a container for the toggle button
          'max-[700px]:top-4 max-[700px]:right-[4.5rem] max-[700px]:left-auto max-[700px]:translate-x-0 max-[700px]:p-0 max-[700px]:bg-transparent max-[700px]:shadow-none max-[700px]:backdrop-blur-none'
        )}
      >
        <button
          className="hidden max-[700px]:flex items-center justify-center gap-[0.3rem] py-[0.65rem] px-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full cursor-pointer text-[1.15rem] font-medium text-[var(--text-secondary)] shadow-[0_2px_10px_var(--card-shadow)] transition-[color,background-color] duration-200 ease-in-out hover:text-[var(--accent-hover)]"
          onClick={openMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? 'Menu ▲' : 'Menu ▼'}
        </button>

        <div
          className={clsx(
            'flex items-center',
            // Mobile: hide by default
            'max-[700px]:hidden',
            // Mobile open state
            isOpen && 'max-[700px]:!flex max-[700px]:flex-col max-[700px]:items-center max-[700px]:justify-center max-[700px]:gap-1 max-[700px]:fixed max-[700px]:top-[4.5rem] max-[700px]:left-3 max-[700px]:right-3 max-[700px]:z-[1001] max-[700px]:p-4 max-[700px]:bg-[var(--bg-secondary)] max-[700px]:border max-[700px]:border-[var(--border)] max-[700px]:rounded-xl max-[700px]:shadow-[0_8px_32px_var(--card-shadow)] max-[700px]:animate-[slideDown_0.3s_ease]'
          )}
        >
          <Link
            className={clsx(
              'inline-block whitespace-nowrap mx-[0.9rem] no-underline font-medium text-[var(--text-secondary)] transition-[margin,opacity,color,transform] duration-[350ms] ease-in-out hover:text-[var(--accent-hover)] hover:-translate-y-px',
              isOpen && 'max-[700px]:block max-[700px]:w-full max-[700px]:py-3 max-[700px]:mx-0 max-[700px]:text-base max-[700px]:text-center max-[700px]:text-[var(--text-primary)] max-[700px]:border-b max-[700px]:border-[var(--border)] max-[700px]:hover:bg-[var(--tag-bg)] max-[700px]:hover:text-[var(--accent)]'
            )}
            href="/"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            className={clsx(
              'inline-block whitespace-nowrap mx-[0.9rem] no-underline font-medium text-[var(--text-secondary)] transition-[margin,opacity,color,transform] duration-[350ms] ease-in-out hover:text-[var(--accent-hover)] hover:-translate-y-px',
              isOpen && 'max-[700px]:block max-[700px]:w-full max-[700px]:py-3 max-[700px]:mx-0 max-[700px]:text-base max-[700px]:text-center max-[700px]:text-[var(--text-primary)] max-[700px]:border-b max-[700px]:border-[var(--border)] max-[700px]:hover:bg-[var(--tag-bg)] max-[700px]:hover:text-[var(--accent)]'
            )}
            href="/resume"
            onClick={() => setIsOpen(false)}
          >
            Resume
          </Link>

          <Link
            className={clsx(
              'inline-block whitespace-nowrap mx-[0.9rem] no-underline font-medium text-[var(--text-secondary)] transition-[margin,opacity,color,transform] duration-[350ms] ease-in-out hover:text-[var(--accent-hover)] hover:-translate-y-px',
              isOpen && 'max-[700px]:block max-[700px]:w-full max-[700px]:py-3 max-[700px]:mx-0 max-[700px]:text-base max-[700px]:text-center max-[700px]:text-[var(--text-primary)] max-[700px]:border-b max-[700px]:border-[var(--border)] max-[700px]:hover:bg-[var(--tag-bg)] max-[700px]:hover:text-[var(--accent)]'
            )}
            href="/contact"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          <Link
            className={clsx(
              'inline-block whitespace-nowrap mx-[0.9rem] no-underline font-medium text-[var(--text-secondary)] transition-[margin,opacity,color,transform] duration-[350ms] ease-in-out hover:text-[var(--accent-hover)] hover:-translate-y-px',
              isOpen && 'max-[700px]:block max-[700px]:w-full max-[700px]:py-3 max-[700px]:mx-0 max-[700px]:text-base max-[700px]:text-center max-[700px]:text-[var(--text-primary)] max-[700px]:border-b-0 max-[700px]:hover:bg-[var(--tag-bg)] max-[700px]:hover:text-[var(--accent)]'
            )}
            href="/projects"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
        </div>
      </nav>
    </>
  );
}
