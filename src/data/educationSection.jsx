import EducationCard from "../cards/educationCard";

const educationData = {
  school: "Morehouse College",
  degree: "B.S.",
  major: "Computer Science",
  date: "2018 – 2022",
  location: "Atlanta, Georgia",
  //description:
  //  "Focused on software engineering, human–computer interaction, and machine learning. Graduated with distinction.",
  activities: ["Magna Cum Laude", "Alpha Phi Alpha", "Howard Thurman Honors Program", "Student Ambassador"],
  logo: "/morehouse-college-logo-3359767914.png",
  link: "https://morehouse.edu/",
};

function EducationSection() {
  return (
    <div>
      <h2 id="education">Education</h2>
      <EducationCard education={educationData} />
    </div>
  );
}

export default EducationSection;