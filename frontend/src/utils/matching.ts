import { Freelancer, Project } from '../types';

export interface MatchResult {
  score: number; // 0 to 100
  skillsMatched: string[];
  skillsMissing: string[];
  locationMatch: boolean;
  distanceKm: number;
  explanation: string;
}

export function calculateFreelancerMatch(freelancer: Freelancer, project: Partial<Project>): MatchResult {
  const reqSkills = project.requiredSkills || [];
  const freelancerSkills = freelancer.skills.map(s => s.toLowerCase());

  // Skills overlap
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  reqSkills.forEach(req => {
    const isMatch = freelancerSkills.some(fs => 
      fs.includes(req.toLowerCase()) || req.toLowerCase().includes(fs)
    );
    if (isMatch) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const skillScore = reqSkills.length > 0 
    ? (matchedSkills.length / reqSkills.length) * 50 
    : 40;

  // Location match
  let locationScore = 15;
  let isLocationMatch = false;
  const projectArea = (project.preferredArea || project.clientLocation || '').toLowerCase();
  const freelancerArea = freelancer.areaName.toLowerCase();

  if (projectArea.includes('any') || projectArea.includes('remote')) {
    locationScore = 25;
    isLocationMatch = true;
  } else if (projectArea && freelancerArea && (projectArea.includes(freelancerArea) || freelancerArea.includes(projectArea))) {
    locationScore = 30;
    isLocationMatch = true;
  } else if (freelancer.distanceFromBoisarKm <= 15) {
    locationScore = 22;
    isLocationMatch = true;
  } else {
    locationScore = 10;
  }

  // Category match
  let categoryScore = 0;
  if (project.category && freelancer.category.toLowerCase().includes(project.category.toLowerCase())) {
    categoryScore = 10;
  } else {
    categoryScore = 5;
  }

  // Rating & Experience
  const ratingScore = (freelancer.rating / 5) * 5;
  const experienceScore = Math.min(freelancer.experienceYears * 1, 5);

  const totalScore = Math.min(100, Math.round(skillScore + locationScore + categoryScore + ratingScore + experienceScore));

  // Build human transparent explanation
  const explanations: string[] = [];
  if (reqSkills.length > 0) {
    explanations.push(`Matches ${matchedSkills.length} of ${reqSkills.length} skills`);
  }
  if (isLocationMatch) {
    explanations.push(`Located in ${freelancer.areaName} (~${freelancer.distanceFromBoisarKm} km away)`);
  }
  if (freelancer.rating >= 4.8) {
    explanations.push(`Top-rated (${freelancer.rating}★ with ${freelancer.reviewCount} local reviews)`);
  }

  return {
    score: totalScore,
    skillsMatched: matchedSkills,
    skillsMissing: missingSkills,
    locationMatch: isLocationMatch,
    distanceKm: freelancer.distanceFromBoisarKm,
    explanation: explanations.join(' · ') || 'Relevant skill match in Maharashtra region'
  };
}
