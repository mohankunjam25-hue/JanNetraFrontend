// Governance Hierarchy Types
export type AdministrativeLevel = 'central' | 'state' | 'district' | 'block' | 'village';

export interface UserLocation {
  state: string;
  district: string;
  block?: string;
  village?: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  level: AdministrativeLevel;
  imageUrl?: string;
  verified: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  type: string; // e.g., 'Financial', 'Health', 'Education'
  level: AdministrativeLevel;
  description: string;
  link?: string;
}

export interface User {
  _id: string;
  fullName: string;
  name?: string;
  username: string;
  email: string;
  mobile: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  category?: string;
  career?: string[];
  interests: string[];
  state: string;
  district: string;
  block?: string;
  village?: string;
  voiceCount: number;
  championsCount: number;
  alliesCount: number;
  contributionScore: number;
  reputationScore: number;
  joinedDate: string;
  isVerified: boolean;
  isTwoFactorEnabled?: boolean;
  settings?: any;
  socialLinks?: {
    x?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  image?: string;
  timestamp: string;
  appreciations?: number;
  comments: number;
  likes?: number;
}
