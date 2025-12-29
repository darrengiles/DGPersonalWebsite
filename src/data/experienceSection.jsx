import ExperienceCard from "../cards/experienceCard";

const experienceData = [
  {
  role: "Product Manager II",
  company: "Microsoft",
  organization: "Azure Monitor - Metrics Platform ",
  location: "Redmond, Washington",
  years: "Jul 2022 – July 2025",
  points: [
  "Led go-to-market strategy that secured Azure Monitor’s inclusion in the 2023 Gartner Magic Quadrant by aligning 14+ cross-functional partner teams and refining product positioning.",
  "Redesigned internal platform APIs to simplify setup for enterprise users, cut onboarding time by 99% (weeks → minutes), and drive a 10× increase in adoption through intuitive controls and clearer workflows.",
  "Reduced feature support tickets by 35% by turning customer feedback into clearer documentation and product improvements, freeing support teams to focus on higher‑value work.",
  "Delivered $100K in monthly efficiency gains by analyzing real‑time product signals and automating de‑provisioning workflows that removed manual bottlenecks.",
  "Delivered SLO platform functionality that let teams define custom metrics and derive actionable insights from real‑time data, turning a technical backend into an intuitive decision‑support tool adopted across the company."
  ],
  logo: "/microsoft-logo.png",
  link: "https://azure.microsoft.com/"
  },
  {
  role: "Product Manager Intern",
  company: "Microsoft",
  organization: "Azure Observability & Security",
  location: "Redmond, Washington",
  years: "Summers 2019 – 2021",
  points: [
    "Designed and implemented phishing triage automation, reducing review time by 78% and saving $150K annually.",
    "Developed internal visualization dashboards in C# that streamlined team workflows and boosted productivity by 15%, improving data accessibility and decision speed.",
    "Built internal tooling that identified unused security team resources, driving $6M+ projected cost savings."
  ],
  logo: "/microsoft-logo.png",
  link: "https://azure.microsoft.com/"
}
];

function ExperienceSection() {
  return (
    <div>
      <h2 id="experience">Experience</h2>
      {experienceData.map((exp, index) => (
        <ExperienceCard key={index} experience={exp} />
      ))}
    </div>
  );
}

export default ExperienceSection;