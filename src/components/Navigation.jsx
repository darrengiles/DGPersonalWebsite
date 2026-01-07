import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navigation.css";

function Navigation({ aboutLoaded = true }) {
  const routerLocation = useLocation();
  const isHome = routerLocation.pathname === "/";
  const [isOpen, setIsOpen] = useState(false);

  function openMenu(){
    setIsOpen((prev) => !prev)
    console.log("Menu toggle");
  }

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isHome || !aboutLoaded) return;

    const nav = document.querySelector(".navbar");
    const aboutSection = document.getElementById("about");
    if (!nav || !aboutSection) return;

    const handleScroll = () => {
      const rect = aboutSection.getBoundingClientRect();
      const winH = window.innerHeight;

      if (rect.bottom < winH * 0.1) nav.classList.add("hidden");
      else nav.classList.remove("hidden");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [aboutLoaded, isHome]);

  // ------------------------------------------------------
  // Existing behavior: Shrink navbar when not on home
  // ------------------------------------------------------
  useEffect(() => {
    const nav = document.querySelector(".navbar");
    if (!nav) return;

    nav.classList.toggle("shrunk", !isHome);
    nav.classList.remove("hidden");
  }, [isHome]);

  // Debug helper (safe to remove later)
  useEffect(() => {
    console.log("NAV MOUNT");
    return () => console.log("NAV UNMOUNT");
  }, []);

  return (
    <>
      {isOpen && <div className="menu-overlay" onClick={() => setIsOpen(false)} />}

      <nav className="navbar">
        <button className="menu-toggle" onClick={openMenu} aria-label="Toggle menu">
          {isOpen ? "Menu ▲" : "Menu ▼"}
        </button>

        <div className={`menu-list ${isOpen ? "open" : ""}`}>
          <Link className="nav-link" to="/" onClick={() => setIsOpen(false)}>
            About
          </Link>

          <a
            className={`nav-link nav-collapse ${isHome ? "" : "is-collapsed"}`}
            href="#education"
            onClick={() => setIsOpen(false)}
          >
            Education
          </a>

          <a
            className={`nav-link nav-collapse ${isHome ? "" : "is-collapsed"}`}
            href="#experience"
            onClick={() => setIsOpen(false)}
          >
            Experience
          </a>

          <Link className="nav-link" to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          <Link className="nav-link" to="/playground" onClick={() => setIsOpen(false)}>
            Playground
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navigation;