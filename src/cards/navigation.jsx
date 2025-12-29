import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/styles.css";

function Navigation({ aboutLoaded = true }) {
  const routerLocation = useLocation();
  const isHome = routerLocation.pathname === "/";

  // Hide navbar on scroll past About (only meaningful on home)
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

  // Shrink pill styling when not on home
  useEffect(() => {
    const nav = document.querySelector(".navbar");
    if (!nav) return;

    nav.classList.toggle("shrunk", !isHome);
    nav.classList.remove("hidden");
  }, [isHome]);

useEffect(() => {
  console.log("NAV MOUNT");
  return () => console.log("NAV UNMOUNT");
}, []);

  return (
    <nav className="navbar">
      <Link className="nav-link" to="/">
        About
      </Link>

      {/* Always render, but collapse on non-home so the bar animates shrinking */}
      <a
        className={`nav-link nav-collapse ${isHome ? "" : "is-collapsed"}`}
        href="#education"
      >
        Education
      </a>
      <a
        className={`nav-link nav-collapse ${isHome ? "" : "is-collapsed"}`}
        href="#experience"
      >
        Experience
      </a>

      <Link className="nav-link" to="/contact">
        Contact
      </Link>
      <Link className="nav-link" to="/playground">
        Playground
      </Link>
    </nav>
  );
}

export default Navigation;