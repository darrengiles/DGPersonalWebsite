import React from 'react';
import Image from 'next/image';
import type { Experience } from '@/types';
import '@/styles/experienceCard.css';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
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
      {logo && (
        <Image
          src={logo}
          alt={`${company} logo`}
          width={60}
          height={60}
          className="company-logo"
        />
      )}

      <div className="card-content">
        <a href={link} target="_blank" rel="noreferrer" className="card-link">
          <h3 className="role-title">{role}</h3>
          <p className="company">
            {company}
            {organization && ` · ${organization}`}
          </p>

          <div className="meta">
            <p className="years">{years}</p>
            <p className="location">{location}</p>
          </div>

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
