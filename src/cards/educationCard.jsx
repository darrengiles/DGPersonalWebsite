import React from "react";
import "../styles/educationCard.css";

function EducationCard({ education }) {
  const {
    school,
    degree,
    major,
    date,
    location,
    description,
    activities,
    logo,
    link,
  } = education;

  return (
    <div className="education-card">
      {/* --- Left Column: Logo --- */}
      {logo && (
        <img
          src={logo}
          alt={`${school} logo`}
          className="school-logo"
        />
      )}

      {/* --- Right Column: All Text Content --- */}
      <div className="card-content">
        <a href={link} target="_blank" rel="noreferrer" className="card-link">
          <h3 className="school-name">{school}</h3>
          <p className="degree">
            {degree} in {major} • {date}
          </p>
          <p className="location">{location}</p>
          <p className="description">{description}</p>

          <div className="activities">
            {activities?.map((item, i) => (
              <span key={i} className="activity-tag">
                {item}
              </span>
            ))}
          </div>
        </a>
      </div>
    </div>
  );
}

export default EducationCard;