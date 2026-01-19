import React from 'react';
import Image from 'next/image';
import type { Education } from '@/types';
import '@/styles/educationCard.css';

interface EducationCardProps {
  education: Education;
}

export default function EducationCard({ education }: EducationCardProps) {
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
      {logo && (
        <Image
          src={logo}
          alt={`${school} logo`}
          width={60}
          height={60}
          className="school-logo"
        />
      )}

      <div className="card-content">
        <a href={link} target="_blank" rel="noreferrer" className="card-link">
          <h3 className="school-name">{school}</h3>
          <p className="degree">
            {degree} in {major} • {date}
          </p>
          <p className="location">{location}</p>
          {description && <p className="description">{description}</p>}

          {activities && activities.length > 0 && (
            <div className="activities">
              {activities.map((item, i) => (
                <span key={i} className="activity-tag">
                  {item}
                </span>
              ))}
            </div>
          )}
        </a>
      </div>
    </div>
  );
}
