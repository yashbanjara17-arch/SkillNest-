export type UserRole = 'client' | 'freelancer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  location: string;
  bio?: string;
  organization?: string;
  status?: 'Active' | 'Suspended' | 'Pending Verification';
  joinedDate?: string;
  phone?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  completionYear: string;
  clientType: string;
  skillsUsed: string[];
  liveUrl?: string;
}

export interface Review {
  id: string;
  clientName: string;
  clientCompany?: string;
  clientLocation: string;
  rating: number;
  date: string;
  comment: string;
  projectTitle: string;
  verified?: boolean;
}

export interface FreelancerService {
  id: string;
  title: string;
  description: string;
  startingPriceInr: number;
  deliveryTimeDays: number;
}

export interface Freelancer {
  id: string;
  userId?: string;
  name: string;
  headline: string;
  bio: string;
  avatar: string;
  location: string; // e.g. "Boisar, Palghar Dist."
  areaName: string; // e.g. "Boisar", "Palghar", "Tarapur MIDC", "Dahanu", "Virar"
  distanceFromBoisarKm: number;
  isTeam: boolean;
  teamSize?: number;
  teamMembers?: string[];
  hourlyRateInr: number;
  startingProjectRateInr: number;
  rating: number;
  reviewCount: number;
  availability: 'Available Immediately' | 'Part-time Available' | 'Booked (Available Next Month)' | 'Weekends Only';
  experienceYears: number;
  category: 'Web & App Development' | 'UI/UX & Graphic Design' | 'Digital Marketing & SEO' | 'Video & Media Production' | 'Industrial & CAD Engineering' | 'Content & Copywriting';
  skills: string[];
  languages: string[];
  verifiedLocal: boolean;
  portfolio: PortfolioItem[];
  services: FreelancerService[];
  reviews: Review[];
  completedProjectsCount: number;
  contactPreference: 'Phone & WhatsApp' | 'Email & SkillNest Direct' | 'In-person Meeting First';
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  clientLocation: string;
  preferredArea: string; // "Boisar", "Palghar", "Tarapur MIDC", "Any Nearby", "Remote"
  budgetMinInr: number;
  budgetMaxInr: number;
  isBudgetNegotiable: boolean;
  timeline: string;
  preferredWorkerType: 'Individual Freelancer' | 'Agency / Freelance Team' | 'Any';
  clientId: string;
  clientName: string;
  clientOrganization?: string;
  postedDate: string;
  status: 'Open' | 'In Discussion' | 'Assigned' | 'Completed' | 'Flagged';
  proposalsCount: number;
  contactPreference: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerHeadline: string;
  freelancerLocation: string;
  proposedPriceInr: number;
  estimatedTimeline: string;
  coverMessage: string;
  submittedAt: string;
  status: 'Pending' | 'Accepted' | 'Negotiating' | 'Declined';
}

export interface DirectInquiry {
  id: string;
  freelancerId: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectTitle: string;
  initialMessage: string;
  proposedBudgetInr?: number;
  meetingPreference: 'In-person (Local)' | 'Phone Call' | 'Video Meeting';
  createdAt: string;
  status: 'Unread' | 'Replied' | 'Deal Agreed';
  replies?: Array<{
    senderId: string;
    senderName: string;
    message: string;
    sentAt: string;
  }>;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
