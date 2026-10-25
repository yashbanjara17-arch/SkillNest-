import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { Briefcase, Trash2, ExternalLink, MapPin, Tag } from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const { projects, updateProjectStatus, deleteProject } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filtered = filterStatus === 'All' 
    ? projects 
    : projects.filter(p => p.status === filterStatus);

  return (
    <WorkspaceShell
      title="Project Listings Moderation"
      subtitle="Inspect, moderate, and manage client project submissions across Boisar and Palghar"
    >
      <div className="space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-3 text-xs overflow-x-auto">
          {['All', 'Open', 'In Discussion', 'Assigned', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {st} ({st === 'All' ? projects.length : projects.filter(p => p.status === st).length})
            </button>
          ))}
        </div>

        {/* Project Listings */}
        <div className="space-y-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <span className="text-indigo-400 font-bold uppercase">{proj.category}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    <span>{proj.clientLocation}</span>
                  </span>
                  <span>·</span>
                  <span>Posted by <strong className="text-neutral-200">{proj.clientName}</strong></span>
                </div>

                <Link
                  to={`/project/${proj.id}`}
                  className="text-base font-bold text-white hover:text-indigo-400 transition-colors block"
                >
                  {proj.title}
                </Link>

                <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex items-center gap-3 text-neutral-400 text-[11px] pt-1">
                  <span>Budget: <strong className="text-white font-bold">₹{proj.budgetMinInr.toLocaleString('en-IN')} - ₹{proj.budgetMaxInr.toLocaleString('en-IN')}</strong></span>
                  <span>·</span>
                  <span>Timeline: <strong className="text-neutral-200">{proj.timeline}</strong></span>
                  <span>·</span>
                  <span>Proposals: <strong className="text-neutral-200">{proj.proposalsCount}</strong></span>
                </div>
              </div>

              <div className="flex sm:flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-neutral-400">Status:</span>
                  <select
                    value={proj.status}
                    onChange={(e) => updateProjectStatus(proj.id, e.target.value as any)}
                    className="bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-white font-bold outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/project/${proj.id}`}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <span>View Scope</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                    title="Archive listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
};
