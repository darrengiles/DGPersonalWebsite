import React from 'react';
import EducationCard from '@/components/cards/EducationCard';
import { educationData } from '@/data/education';

export default function EducationSection() {
  return (
    <div>
      <h2 id="education">Education</h2>
      <EducationCard education={educationData} />
    </div>
  );
}
