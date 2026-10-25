import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { PlusCircle, MapPin, Clock, Users, ArrowRight, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

export const ClientProjectsPage: React.FC = () => {
  const { currentUser, projects, proposals, updateProjectStatus } = useApp();
  const [activeStatus, setActiveStatus] = useState<string>('All');

  // Filter projects owned by client
  const myProjects = projects.filter(
    p => p.clientId === currentUser?.id || p.clientName === currentUser?.name
  );
  const displayList = myProjects;

  const filtered = activeStatus === 'All'
    ? displayList
    : displayList.filter(p => p.status === activeStatus);

  return (
    <WorkspaceShell
      title="Your Projects"
      subtitle="Track your open requests, review applicants, and manage deliverables with local professionals"
      action={
        <Link
          to="/post-project"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Request</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Status Tabs (Plain language) */}
        <div className="flex gap-2 border-b border-white/10 pb-3 text-xs overflow-x-auto">
          {['All', 'Open', 'In Discussion', 'Assigned', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors ${
                activeStatus === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {st} ({st === 'All' ? displayList.length : displayList.filter(p => p.status === st).length})
            </button>
          ))}
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No projects found</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  {activeStatus === 'All'
                    ? "You haven't posted any project requirements yet. Post a project to connect with skilled local freelancers."
                    : `You have no projects with status "${activeStatus}".`}
                </p>
              </div>
              <Link
                to="/post-project"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your First Project</span>
              </Link>
            </GlassCard>
          ) : (
            filtered.map((proj) => {
              const projectProposals = proposals.filter(p => p.projectId === proj.id);

              return (
                <GlassCard key={proj.id} className="p-6 space-y-4 text-xs">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[11px] flex-wrap">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">{proj.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span>{proj.preferredArea}</span>
                      </span>
                      <span>·</span>
                      <span>Posted on {proj.postedDate}</span>
                    </div>

                    <Link
                      to={`/project/${proj.id}`}
                      className="text-lg font-bold text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                    >
                      {proj.title}
                    </Link>

                    <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed line-clamp-2">
                      {proj.description}
                    </p>

                    <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400 text-xs pt-1">
                      <span>Your Budget: <strong className="text-neutral-900 dark:text-white font-bold tabular-nums">₹{proj.budgetMinInr.toLocaleString('en-IN')} - ₹{proj.budgetMaxInr.toLocaleString('en-IN')}</strong></span>
                      <span>·</span>
                      <span>Timeline: <strong className="text-neutral-800 dark:text-neutral-200">{proj.timeline}</strong></span>
                      <span>·</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{projectProposals.length} Proposals Received</span>
                    </div>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="flex sm:flex-col items-end gap-2.5 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">Current Status:</span>
                      <select
                        value={proj.status}
                        onChange={(e) => updateProjectStatus(proj.id, e.target.value as any)}
                        className="sn-select w-auto py-1.5 px-2.5 font-bold text-xs"
                      >
                        <option value="Open">Open for proposals</option>
                        <option value="In Discussion">In Discussion</option>
                        <option value="Assigned">Assigned & In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <Link
                      to={`/project/${proj.id}`}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-900 dark:text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Review Proposals ({projectProposals.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Proposals preview drawer snippet */}
                {projectProposals.length > 0 && (
                  <div className="pt-3 border-t sn-border-subtle space-y-2">
                    <p className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Recent Interested Freelancers:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {projectProposals.slice(0, 2).map((prop) => (
                        <div key={prop.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/80 dark:border-white/5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={prop.freelancerAvatar} alt={prop.freelancerName} className="w-7 h-7 rounded-lg object-cover" />
                            <div className="truncate">
                              <p className="font-bold text-neutral-900 dark:text-white text-xs truncate">{prop.freelancerName}</p>
                              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">Quote: ₹{prop.proposedPriceInr.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <Link
                            to={`/freelancer/${prop.freelancerId}`}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold text-[11px] shrink-0"
                          >
                            View Profile
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          }))}
        </div>
      </div>
    </WorkspaceShell>
  );
};
