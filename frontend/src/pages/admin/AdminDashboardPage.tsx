import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { users, projects, freelancers, proposals, inquiries, verifyFreelancer, deleteProject } = useApp();

  const totalClients = users.filter(u => u.role === 'client').length;
  const totalFreelancers = users.filter(u => u.role === 'freelancer').length;
  const activeProjects = projects.filter(p => p.status === 'Open').length;
  const totalBudgetEst = projects.reduce((acc, p) => acc + (p.budgetMinInr + p.budgetMaxInr) / 2, 0);

  // Regional breakdown
  const regionalCounts = {
    Boisar: freelancers.filter(f => f.areaName === 'Boisar').length,
    Palghar: freelancers.filter(f => f.areaName === 'Palghar').length,
    'Tarapur MIDC': freelancers.filter(f => f.areaName === 'Tarapur MIDC').length,
    Dahanu: freelancers.filter(f => f.areaName === 'Dahanu').length,
  };

  return (
    <WorkspaceShell
      title="Platform Operations Console"
      subtitle="Administrative oversight for Boisar, Palghar & Tarapur local marketplace activity"
    >
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Total Community Members</span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">{users.length}</p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{totalClients} Clients</span>
            <span>·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{totalFreelancers} Freelancers</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Active Project Postings</span>
            <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">{activeProjects}</p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">
            Across {projects.length} lifetime listings
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Estimated Project Value</span>
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">
            ₹{Math.round(totalBudgetEst).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
            0% fee kept · 100% direct value
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs">
            <span>Interactions & Inquiries</span>
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2 tabular-nums">
            {proposals.length + inquiries.length}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>{proposals.length} Proposals</span>
            <span>·</span>
            <span>{inquiries.length} Inquiries</span>
          </div>
        </GlassCard>
      </div>

      {/* Main Administrative Sections: Moderation queue & Regional stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recent Projects to Moderate */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Project Listings Moderation Queue</span>
            </h3>
            <Link to="/admin/projects" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>View All Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-neutral-200/90 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                <div>
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[11px]">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{p.category}</span>
                    <span>·</span>
                    <span>By {p.clientName} ({p.clientLocation})</span>
                    <span>·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">{p.status}</span>
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">{p.title}</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-[11px] line-clamp-1 mt-0.5">{p.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/project/${p.id}`}
                    className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-800 dark:text-white font-medium text-[11px] transition-colors"
                  >
                    Inspect
                  </Link>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/30 font-medium text-[11px] transition-colors border border-rose-200 dark:border-rose-500/30"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Local Regional Distribution & Quick Tools */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Regional Coverage Distribution</span>
            </h3>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
              Verified local service providers by industrial & commercial cluster:
            </p>

            <div className="space-y-3 text-xs">
              {Object.entries(regionalCounts).map(([region, count]) => (
                <div key={region} className="space-y-1">
                  <div className="flex justify-between text-neutral-700 dark:text-neutral-300 font-medium text-[11px]">
                    <span>{region}</span>
                    <span className="tabular-nums font-semibold">{count} Specialists</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.max(15, (count / freelancers.length) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Quick Administrative Actions</span>
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/admin/users"
                className="block p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 font-medium transition-colors"
              >
                Manage User Verification & Roles →
              </Link>
              <Link
                to="/admin/reviews"
                className="block p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 font-medium transition-colors"
              >
                Inspect Local Business Reviews →
              </Link>
              <Link
                to="/post-project"
                className="block p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 font-medium transition-colors"
              >
                Test Client Project Wizard →
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </WorkspaceShell>
  );
};
