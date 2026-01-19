import Link from 'next/link';
import type { Project } from '@/types';
import '@/styles/projects.css';

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
        <div className="projects-header">
          <h1 className="projects-title">Projects</h1>
          <p className="projects-subtitle">Experimental features and tools</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="project-card"
            >
              <span className="project-icon">{project.icon}</span>
              <h2 className="project-title">{project.title}</h2>
              <p className="project-description">{project.description}</p>
              <span className="project-arrow">Try it out →</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
