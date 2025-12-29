import React from "react";
import "../styles/experienceCard.css";

function ExperienceCard({ experience }) {
  const {
    role,
    company,
    organization,
    location,
    years,
    points,
    logo,
    link,
  } = experience;

  return (
    <div className="experience-card">
      {/* --- Left column: logo --- */}
      {logo && (
        <img
          src={logo}
          alt={`${company} logo`}
          className="company-logo"
        />
      )}

      {/* --- Right column: all content --- */}
      <div className="card-content">
        <a href={link} target="_blank" rel="noreferrer" className="card-link">
          {/* Title + company */}
          <h3 className="role-title">{role}</h3>
          <p className="company">
            {company}
            {organization && ` · ${organization}`}
          </p>

          {/* location + years */}
          <div className="meta">
            <p className="years">{years}</p>
            <p className="location">{location}</p>
          </div>

          {/* bullet points */}
          <ul className="points">
            {points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </a>
      </div>
    </div>
  );
}

export default ExperienceCard;