import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WorkspaceShell } from '../components/layout/WorkspaceShell';
import { GlassCard } from '../components/ui/GlassCard';
import { ProjectCard } from '../components/projects/ProjectCard';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  PlusCircle, 
  CheckCircle2, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Layers,
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';

export const FreelancerDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    currentFreelancerProfile,
    projects, 
    proposals, 
    inquiries, 
    savedProjectIds 
  } = useApp();

  const myProfile = currentFreelancerProfile || {
    id: `fl-${currentUser?.id}`,
    name: currentUser?.name || 'Freelancer',
    headline: '',
    bio: '',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    location: currentUser?.location || 'Boisar, Maharashtra',
    areaName: 'Boisar',
    distanceFromBoisarKm: 0,
    isTeam: false,
    hourlyRateInr: 0,
    startingProjectRateInr: 0,
    rating: 0,
    reviewCount: 0,
    availability: 'Available Immediately' as const,
    experienceYears: 0,
    category: 'Web & App Development' as const,
    skills: [],
    languages: ['Marathi', 'Hindi', 'English'],
    verifiedLocal: false,
    portfolio: [],
    services: [],
    reviews: [],
    completedProjectsCount: 0,
    contactPreference: 'Phone & WhatsApp' as const,
  };

  const myProposals = proposals.filter(
    p => p.freelancerName === currentUser?.name || p.freelancerId === myProfile.id
  );

  const receivedInquiries = inquiries.filter(
    inq => inq.freelancerId === myProfile.id
  );

  const savedProjectsList = projects.filter(p => savedProjectIds.includes(p.id));

  // Recommended local projects
  const recommendedProjects = projects.slice(0, 3);

  // Dynamic Profile Strength calculation
  const profileStrength = Math.min(
    100,
    [
      Boolean(myProfile.headline?.trim()),
      Boolean(myProfile.bio?.trim()),
      myProfile.skills.length > 0,
      myProfile.startingProjectRateInr > 0 || myProfile.hourlyRateInr > 0,
      myProfile.portfolio.length > 0,
    ].filter(Boolean).length * 20
  );

  return (
    <WorkspaceShell
      title={`Freelancer Workspace · ${myProfile.name}`}
      subtitle={myProfile.headline ? `${myProfile.headline} · ${myProfile.location}` : `${myProfile.location} · Profile incomplete`}
      action={
        <Link
          to="/freelancer/portfolio"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Layers className="w-4 h-4" />
          <span>Manage Portfolio</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Profile Health & Status Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={myProfile.avatar}
              alt={myProfile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/30 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">{myProfile.name}</h3>
                {myProfile.verifiedLocal && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Verified Local</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-300 font-medium">
                {myProfile.headline || (
                  <Link to="/freelancer/profile" className="text-indigo-400 hover:underline">
                    + Add your professional headline
                  </Link>
                )}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{myProfile.rating} ({myProfile.reviewCount} local reviews)</span>
                </span>
                <span>·</span>
                <span className="text-emerald-400">{myProfile.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left w-full sm:w-44">
              <div className="flex justify-between items-center text-[11px] text-neutral-400 mb-1">
                <span>Profile Strength</span>
                <span className={`font-bold ${profileStrength === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {profileStrength}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${profileStrength === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${profileStrength}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-neutral-500 block mt-1">
                {profileStrength === 100 ? 'Verified Boisar/Palghar local' : (
                  <Link to="/freelancer/profile" className="text-indigo-400 hover:underline">
                    Complete your profile →
                  </Link>
                )}
              </span>
            </div>

            <Link
              to="/freelancer/profile"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* 3 Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 text-xs">
              <span>Proposals Submitted</span>
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">{myProposals.length}</p>
            <Link to="/freelancer/applications" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1 block font-medium">
              Track project applications →
            </Link>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 text-xs">
              <span>Direct Client Inquiries</span>
              <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">{receivedInquiries.length}</p>
            <Link to="/freelancer/inquiries" className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline mt-1 block font-medium">
              View client inquiries & reply →
            </Link>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 text-xs">
              <span>Portfolio Deliverables</span>
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">{myProfile.portfolio.length}</p>
            <Link to="/freelancer/portfolio" className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline mt-1 block font-medium">
              Manage work samples →
            </Link>
          </GlassCard>
        </div>

        {/* Recommended Open Opportunities in Boisar & Palghar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Recommended Local Projects</span>
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Matching requirements posted by nearby businesses:</p>
            </div>
            <Link to="/projects" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>Explore All {projects.length} Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
};
