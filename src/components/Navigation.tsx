'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const linkBase =
  'no-underline font-medium text-xl !text-[var(--nav-text)] transition-colors duration-200 ease-in-out hover:!text-[var(--accent-hover)]';

const mobileLinkOpen =
  'max-[700px]:block max-[700px]:w-full max-[700px]:py-3 max-[700px]:mx-0 max-[700px]:text-base max-[700px]:text-center max-[700px]:text-[var(--text-primary)] max-[700px]:border-b max-[700px]:border-[var(--border)] max-[700px]:hover:bg-[var(--tag-bg)] max-[700px]:hover:text-[var(--accent)]';

export default function Navigation() {
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
          'absolute top-0 right-0 z-50 flex items-center gap-8 py-6 pr-[5%]',
          'max-[700px]:top-4 max-[700px]:right-[4.5rem] max-[700px]:p-0'
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
            'flex items-center gap-8',
            'max-[700px]:hidden',
            isOpen && 'max-[700px]:!flex max-[700px]:flex-col max-[700px]:items-center max-[700px]:justify-center max-[700px]:gap-1 max-[700px]:fixed max-[700px]:top-[4.5rem] max-[700px]:left-3 max-[700px]:right-3 max-[700px]:z-[1001] max-[700px]:p-4 max-[700px]:bg-[var(--bg-secondary)] max-[700px]:border max-[700px]:border-[var(--border)] max-[700px]:rounded-xl max-[700px]:shadow-[0_8px_32px_var(--card-shadow)] max-[700px]:animate-[slideDown_0.3s_ease]'
          )}
        >
          {!isHome && (
            <Link
              className={clsx(linkBase, isOpen && mobileLinkOpen)}
              href="/"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          )}

          <Link
            className={clsx(linkBase, isOpen && mobileLinkOpen)}
            href="/resume"
            onClick={() => setIsOpen(false)}
          >
            Resume
          </Link>

          <Link
            className={clsx(
              linkBase,
              isOpen && mobileLinkOpen.replace('border-b', 'border-b-0')
            )}
            href="/thoughts"
            onClick={() => setIsOpen(false)}
          >
            Thoughts
          </Link>
        </div>
      </nav>
    </>
  );
}
