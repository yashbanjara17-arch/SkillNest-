import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { WorkspaceShell } from '../components/layout/WorkspaceShell';
import { GlassCard } from '../components/ui/GlassCard';
import { FreelancerCard } from '../components/freelancers/FreelancerCard';
import { 
  PlusCircle, 
  Briefcase, 
  MessageSquare, 
  Bookmark, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Search,
  Building2,
  Clock
} from 'lucide-react';

export const ClientDashboardPage: React.FC = () => {
  const { currentUser, projects, proposals, inquiries, freelancers, savedFreelancerIds, updateProjectStatus } = useApp();

  const myProjects = projects.filter(
    p => p.clientId === currentUser?.id || p.clientName === currentUser?.name
  );

  const receivedProposals = proposals.filter(prop => 
    myProjects.some(p => p.id === prop.projectId)
  );

  const myInquiries = inquiries.filter(
    inq => inq.clientId === currentUser?.id || inq.clientName === currentUser?.name
  );

  const savedFreelancersList = freelancers.filter(f => savedFreelancerIds.includes(f.id));

  // Recommended freelancers based in the client's area (e.g. Boisar)
  const recommendedFreelancers = freelancers.slice(0, 3);

  return (
    <WorkspaceShell
      title={`Welcome back, ${currentUser?.name || 'Local Business Owner'}`}
      subtitle={`${currentUser?.organization || 'Local Business'} · Boisar & Palghar Local Network`}
      action={
        <Link
          to="/post-project"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Project</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Quick Orientation & Next Steps Card for Non-Technical Clients */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/90 via-indigo-950/90 to-slate-900 border border-indigo-500/30 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md text-white">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-400/30">
              Plain-Language Guide for Business Owners
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Need a website, logo, menu, or factory tool?
            </h2>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              SkillNest connects you directly with skilled professionals living right here in Boisar and Palghar. Post your requirement in plain words or explore portfolios with verified local reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/post-project"
              className="px-4 py-2.5 bg-white text-neutral-900 font-bold rounded-xl text-xs hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Post a Project Requirement</span>
            </Link>
            <Link
              to="/freelancers"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Search Nearby Talent</span>
            </Link>
          </div>
        </div>

        {/* 3 Overview Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
              <span>Your Active Projects</span>
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">{myProjects.length}</p>
            <Link to="/client/projects" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1 block font-medium">
              Manage your listings →
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
              <span>Freelancer Proposals</span>
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">{receivedProposals.length}</p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Ready for direct review</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-xs transition-colors">
            <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
              <span>Messages & Discussions</span>
              <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">{myInquiries.length}</p>
            <Link to="/client/messages" className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1 block font-medium">
              Open conversation threads →
            </Link>
          </div>
        </div>

        {/* Active Projects Quick Inspection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Your Active Projects</span>
            </h3>
            <Link to="/client/projects" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myProjects.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">You haven't posted any projects yet</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                Post your project requirement in plain language to start receiving proposals from verified local talent.
              </p>
              <Link
                to="/post-project"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your First Project</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {myProjects.map((proj) => {
                const projectProposals = proposals.filter(p => p.projectId === proj.id);
                return (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-xs transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[11px]">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">{proj.category}</span>
                        <span>·</span>
                        <span>{proj.preferredArea}</span>
                        <span>·</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{proj.status}</span>
                      </div>
                      <Link
                        to={`/project/${proj.id}`}
                        className="text-base font-bold text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                      >
                        {proj.title}
                      </Link>
                      <p className="text-neutral-600 dark:text-neutral-400 text-xs line-clamp-1">{proj.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="font-bold text-neutral-900 dark:text-white text-xs tabular-nums">
                          ₹{proj.budgetMinInr.toLocaleString('en-IN')} - ₹{proj.budgetMaxInr.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          {projectProposals.length} Proposals
                        </p>
                      </div>

                      <Link
                        to={`/project/${proj.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs transition-colors"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommended Freelancers Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Recommended Local Freelancers for You</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Top-rated talent in Boisar, Palghar, and Tarapur MIDC:</p>
            </div>
            <Link to="/freelancers" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>Explore All {freelancers.length}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedFreelancers.map((fl) => (
              <FreelancerCard key={fl.id} freelancer={fl} />
            ))}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
};
