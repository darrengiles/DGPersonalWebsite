// src/pages/Resume.jsx
import Navigation from "../cards/navigation";
import EducationSection from "../data/educationSection";
import ExperienceSection from "../data/experienceSection";

function Resume({ about }) {
  // Safety check
  if (!about) return <p>Loading...</p>;

  return (
    <div className="app">
      <header>
        {/* Navbar */}
        

        {/* Hero */}
        <section className="hero">
          <h1 className="hero-name">{about.name}</h1>
          <p className="hero-tag">{about.tag}</p>
        </section>
      </header>

      <main className="page-container">
        <section className="about" id="about">
          <h2>About Me</h2>
          <p>{about.description}</p>
        </section>

        <EducationSection />
        <ExperienceSection />

        <footer className="footer">
          <p>
            © 2025 {about.name} |{" "}
            <a href="mailto:darrengiles10@example.com">Contact Me</a>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Resume;