import Link from 'next/link';
import type { Project } from '@/types';

const projects: Project[] = [
  {
    id: 'snowboard-recommender',
    title: 'Snowboard Recommender',
    description: 'AI-powered assistant that helps you find the perfect snowboard based on your riding style, skill level, and preferences.',
    href: '/projects/snowboard-recommender',
    icon: '🏂',
  },
];

export default function ProjectsPage() {
  return (
    <>
      <header className="hero"></header>
      <main className="page-container">
        <div className="text-center mb-10">
          <h1 className="text-[2rem] font-bold text-[var(--text-heading)] m-0 mb-2 max-[700px]:text-[1.75rem]">Projects</h1>
          <p className="text-base text-[var(--text-muted)] m-0">Experimental features and tools</p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 max-w-[900px] mx-auto max-[700px]:grid-cols-1 max-[700px]:gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="flex flex-col p-6 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl no-underline text-inherit transition-[transform,box-shadow,border-color] duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--card-shadow-hover)] hover:border-[var(--accent)] hover:text-inherit max-[700px]:p-5"
            >
              <span className="text-[2.5rem] mb-4">{project.icon}</span>
              <h2 className="text-[1.25rem] font-semibold text-[var(--text-heading)] m-0 mb-2">{project.title}</h2>
              <p className="text-[0.9375rem] text-[var(--text-secondary)] leading-relaxed m-0">{project.description}</p>
              <span className="mt-auto pt-4 text-[0.875rem] text-[var(--accent)] flex items-center gap-1">Try it out →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
