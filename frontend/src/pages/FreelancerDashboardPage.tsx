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
    freelancers, 
    projects, 
    proposals, 
    inquiries, 
    savedProjectIds 
  } = useApp();

  const myProfile = freelancers.find(
    f => f.name === currentUser?.name || f.id === currentUser?.id
  ) || freelancers[0];

  const myProposals = proposals.filter(
    p => p.freelancerName === currentUser?.name || p.freelancerId === myProfile.id
  );

  const receivedInquiries = inquiries.filter(
    inq => inq.freelancerId === myProfile.id
  );

  const savedProjectsList = projects.filter(p => savedProjectIds.includes(p.id));

  // Recommended local projects
  const recommendedProjects = projects.slice(0, 3);

  return (
    <WorkspaceShell
      title={`Freelancer Workspace · ${myProfile.name}`}
      subtitle={`${myProfile.headline} · ${myProfile.location}`}
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
              <p className="text-xs text-neutral-300 font-medium">{myProfile.headline}</p>
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
                <span className="font-bold text-emerald-400">95%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <span className="text-[10px] text-neutral-500 block mt-1">Verified Boisar/Palghar local</span>
            </div>

            <Link
              to={`/freelancer/${myProfile.id}`}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-colors"
            >
              Public Profile
            </Link>
          </div>
        </div>

        {/* 3 Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-5 bg-white/5 border-white/10">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span>Proposals Submitted</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2 tabular-nums">{myProposals.length}</p>
            <Link to="/freelancer/applications" className="text-[11px] text-indigo-400 hover:underline mt-1 block">
              Track project applications →
            </Link>
          </GlassCard>

          <GlassCard className="p-5 bg-white/5 border-white/10">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span>Direct Client Inquiries</span>
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2 tabular-nums">{receivedInquiries.length}</p>
            <Link to="/freelancer/inquiries" className="text-[11px] text-emerald-400 hover:underline mt-1 block">
              View client inquiries & reply →
            </Link>
          </GlassCard>

          <GlassCard className="p-5 bg-white/5 border-white/10">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span>Portfolio Deliverables</span>
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2 tabular-nums">{myProfile.portfolio.length}</p>
            <Link to="/freelancer/portfolio" className="text-[11px] text-sky-400 hover:underline mt-1 block">
              Manage work samples →
            </Link>
          </GlassCard>
        </div>

        {/* Recommended Open Opportunities in Boisar & Palghar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Recommended Local Projects</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">Matching requirements posted by nearby businesses:</p>
            </div>
            <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
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
