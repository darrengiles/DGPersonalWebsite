import React from 'react';
import Image from 'next/image';
import type { Education } from '@/types';

interface EducationCardProps {
  education: Education;
  index?: number;
}

export default function EducationCard({ education, index = 0 }: EducationCardProps) {
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
    <div
      className="grid grid-cols-[80px_1fr] gap-[1.2rem] items-start bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 mb-6 text-[var(--text-primary)] opacity-0 animate-[slideUp_0.5s_cubic-bezier(0.4,0,0.2,1)_forwards] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_24px_var(--card-shadow-hover)]"
      style={{ animationDelay: `${(index + 1) * 0.1}s` }}
    >
      {logo && (
        <Image
          src={logo}
          alt={`${school} logo`}
          width={60}
          height={60}
          className="size-[60px] object-contain block mt-1 rounded-md"
        />
      )}

      <div className="flex flex-col text-left items-start">
        <a href={link} target="_blank" rel="noreferrer" className="no-underline text-inherit block">
          <h3 className="text-[1.1rem] font-semibold text-[var(--text-heading)] m-0">{school}</h3>
          <p className="my-[0.2rem] text-[var(--text-muted)] text-[0.9rem]">
            {degree} in {major} • {date}
          </p>
          <p className="my-[0.2rem] text-[var(--text-muted)] text-[0.9rem]">{location}</p>
          {description && <p className="mt-[0.8rem] leading-relaxed text-[0.95rem] text-[var(--text-secondary)] text-justify">{description}</p>}

          {activities && activities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activities.map((item, i) => (
                <span key={i} className="bg-[var(--tag-bg)] text-[var(--tag-text)] text-[0.8rem] py-[0.3rem] px-[0.6rem] rounded-md italic transition-[background-color,color] duration-300 ease-in-out">
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
