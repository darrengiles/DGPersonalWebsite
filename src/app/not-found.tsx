import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <header className="hero"></header>
      <main className="page-container">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className="text-[8rem] font-bold text-[var(--accent)] leading-none m-0">404</h1>
          <h2 className="text-[1.5rem] font-semibold text-[var(--text-heading)] mt-4 mb-2">Page not found</h2>
          <p className="text-[var(--text-muted)] text-lg mb-8 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white font-medium no-underline transition-[background-color,transform] duration-200 ease-in-out hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95"
          >
            Go Home
          </Link>
        </div>
      </main>
    </>
  );
}
