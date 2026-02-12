import React from 'react';
import ExperienceCard from '@/components/cards/ExperienceCard';
import { experienceData } from '@/data/experience';

export default function ExperienceSection() {
  return (
    <div>
      <h2 id="experience">Experience</h2>
      {experienceData.map((exp, index) => (
        <ExperienceCard key={index} experience={exp} index={index} />
      ))}
    </div>
  );
}
