import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { FileText, Search, Clock, IndianRupee, MapPin, ArrowRight } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export const FreelancerApplicationsPage: React.FC = () => {
  const { proposals, projects, currentUser, currentFreelancerProfile } = useApp();

  const myProposals = proposals.filter(
    p => p.freelancerName === currentUser?.name || p.freelancerId === currentFreelancerProfile?.id
  );

  return (
    <WorkspaceShell
      title="My Proposals & Applications"
      subtitle="Track your quotes, estimated timelines, and response status from local businesses"
      action={
        <Link
          to="/projects"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Discover Projects</span>
        </Link>
      }
    >
      {myProposals.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Showing <strong className="text-neutral-900 dark:text-white">{myProposals.length}</strong> active proposals submitted for local projects:
          </p>

          <div className="space-y-3">
            {myProposals.map((prop) => {
              const proj = projects.find(p => p.id === prop.projectId);
              const statusColors = {
                Pending: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
                Accepted: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
                Negotiating: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30',
                Declined: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30',
              };

              return (
                <GlassCard key={prop.id} className="p-6 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[11px]">
                        <span>Client: <strong className="text-neutral-800 dark:text-white">{proj?.clientName || 'Local Business'}</strong></span>
                        <span>·</span>
                        <span>Submitted on {prop.submittedAt}</span>
                      </div>
                      <Link
                        to={`/project/${prop.projectId}`}
                        className="text-base font-bold text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mt-0.5 block"
                      >
                        {proj?.title || 'Local Project Requirement'}
                      </Link>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                        <span>{proj?.clientLocation}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${statusColors[prop.status] || 'bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-white border-neutral-200 dark:border-white/10'}`}>
                        {prop.status}
                      </span>
                      <p className="text-base font-bold text-neutral-900 dark:text-white mt-1 tabular-nums">
                        ₹{prop.proposedPriceInr.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{prop.estimatedTimeline}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/80 dark:border-white/5 text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                    "{prop.coverMessage}"
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-white/10 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span>Direct terms: 100% of agreed fees paid directly to you.</span>
                    <Link
                      to={`/project/${prop.projectId}`}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <span>View Project Scope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No proposals submitted yet"
          description="Browse projects posted by local businesses in Boisar, Palghar, and Tarapur MIDC to pitch your services."
          actionLabel="Find Projects"
          onAction={() => {}}
        />
      )}
    </WorkspaceShell>
  );
};
