export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  title: string;
  duration: string;
  description: string;
}

export interface SocialAccounts {
  github: string;
  linkedin: string;
  portfolio: string;
}

export interface ProfileDetails {
  photoDataUrl: string | null;
  skills: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  resumeFileName: string | null;
  social: SocialAccounts;
}
