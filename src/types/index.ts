// About data from about.json
export interface SocialLink {
  name: string;
  url: string;
}

export interface Company {
  name: string;
  url: string;
}

export interface About {
  name: string;
  designation: string;
  company: Company;
  tag: string;
  description: string;
  socialLinks: SocialLink[];
}

// Education data
export interface Education {
  school: string;
  degree: string;
  major: string;
  date: string;
  location: string;
  description?: string;
  activities?: string[];
  logo: string;
  link: string;
}

// Experience data
export interface Experience {
  role: string;
  company: string;
  organization?: string;
  location: string;
  years: string;
  points: string[];
  logo: string;
  link: string;
}

// Theme system
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
