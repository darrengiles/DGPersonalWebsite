import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";

import Resume from "./pages/resume";
import Contact from "./pages/contact"
import Playground from "./pages/playground"

import "./styles/styles.css";


function App() {
  const [about, setAbout] = useState(null);

  useEffect (()=> {
    fetch("content/about.json")
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .catch((err) => console.error("Error loading about.json:", err));
  }, []);

  if (!about) {
    return <p>loading...</p>;
  }
  
  return (
    <>
    <ThemeToggle />
    <Navigation aboutLoaded={!!about}/>
    <Routes>
      <Route path="/" element={<Resume about={about}/>}/>
      <Route path="/playground" element={<Playground />}/>
      <Route path="/contact" element={<Contact />} />
    </Routes>
    <Footer />
    </>



//     <div className="app">
//       <a href="#"></a>
// <header>
//   {/* --- Floating nav that stays visible --- */}
//     <Navigation />

//   {/* --- Hero section with name + subtitle --- */}
//   <section className="hero">
//     <h1 className="hero-name">{about.name}</h1>
//     <p className="hero-tag">{about.tag}</p>
//   </section>
// </header>
// <main className="page-container">
//       <section className="about" id="about">
//         <h2 id="about">About Me</h2>
//         <p>{about.description}</p>
//       </section>

//       <EducationSection />
//       <ExperienceSection />
//       <footer className="footer">
//         <p>© 2025 {about.name} | <a href="mailto:darrengiles10@gmail.com">Contact Me</a></p>
//       </footer>
// </main>
//     </div>
  );
  
}


export default App;