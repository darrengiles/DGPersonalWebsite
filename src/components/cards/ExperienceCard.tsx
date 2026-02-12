import React from 'react';
import Image from 'next/image';
import type { Experience } from '@/types';

interface ExperienceCardProps {
  experience: Experience;
  index?: number;
}

export default function ExperienceCard({ experience, index = 0 }: ExperienceCardProps) {
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
    <div
      className="grid grid-cols-[80px_1fr] gap-[1.2rem] items-start bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 mb-6 text-[var(--text-primary)] opacity-0 animate-[slideUp_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_24px_var(--card-shadow-hover)]"
      style={{ animationDelay: `${(index + 1) * 0.1}s` }}
    >
      {logo && (
        <Image
          src={logo}
          alt={`${company} logo`}
          width={60}
          height={60}
          className="size-[60px] object-contain rounded-md"
        />
      )}

      <div className="flex flex-col text-left">
        <a href={link} target="_blank" rel="noreferrer" className="no-underline text-inherit block text-left">
          <h3 className="m-0 text-[1.1rem] font-semibold text-[var(--text-heading)]">{role}</h3>
          <p className="my-1 text-[var(--text-secondary)] text-[0.95rem]">
            {company}
            {organization && ` · ${organization}`}
          </p>

          <div className="flex flex-col text-[var(--text-muted)] text-[0.9rem] mb-[0.6rem]">
            <p className="mb-[0.2rem]">{years}</p>
            <p>{location}</p>
          </div>

          <ul className="mt-3 ml-[1.2rem] p-0 list-disc">
            {points.map((point, i) => (
              <li key={i} className="mb-[0.4rem] text-[0.92rem] leading-[1.4] text-[var(--text-secondary)]">{point}</li>
            ))}
          </ul>
        </a>
      </div>
    </div>
  );
}
