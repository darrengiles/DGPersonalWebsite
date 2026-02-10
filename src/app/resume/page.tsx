import type { About } from '@/types';
import aboutData from '@/../public/content/about.json';
import EducationSection from '@/components/sections/EducationSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import BrickBreakerGame from '@/components/game/BrickBreakerGame';

export default function Resume() {
  const about = aboutData as About;

  return (
    <div className="app">
      <header>
        <section className="hero">
          <h1 className="hero-name">{about.name}</h1>
          <p className="hero-tag">{about.tag}</p>
        </section>
      </header>

      <main className="page-container">
        <BrickBreakerGame description={about.description}>
          <section className="about" id="about">
            <h2>About Me</h2>
            <p>{about.description}</p>
          </section>
          <EducationSection />
        </BrickBreakerGame>
        <ExperienceSection />
      </main>
    </div>
  );
}
