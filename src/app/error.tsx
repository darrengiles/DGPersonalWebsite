'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <header className="hero"></header>
      <main className="page-container">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-[2rem] font-bold text-[var(--text-heading)] mb-4">Something went wrong</h1>
          <p className="text-[var(--text-muted)] text-lg mb-8 max-w-md">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white font-medium border-none cursor-pointer transition-[background-color,transform] duration-200 ease-in-out hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95"
          >
            Try again
          </button>
        </div>
      </main>
    </>
  );
}
