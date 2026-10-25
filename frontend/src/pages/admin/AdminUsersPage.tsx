import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { Search, UserCheck, Shield, ShieldAlert, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { users, updateUserStatus, freelancers, verifyFreelancer } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = 
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.organization && u.organization.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (roleFilter !== 'All' && u.role !== roleFilter) return false;
      if (statusFilter !== 'All' && (u.status || 'Active') !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <WorkspaceShell
      title="User Accounts & Permissions"
      subtitle="Audit registered clients, freelancers, and platform administrators"
    >
      <div className="space-y-6">
        {/* Search & Filters */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name, email, or business..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-400 outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-200 outline-none text-xs"
            >
              <option value="All">All Roles</option>
              <option value="client">Clients Only</option>
              <option value="freelancer">Freelancers Only</option>
              <option value="admin">Admins Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-200 outline-none text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>

            {(search || roleFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => { setSearch(''); setRoleFilter('All'); setStatusFilter('All'); }}
                className="p-2 text-neutral-400 hover:text-white"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {filteredUsers.map((u) => {
                  const matchingFl = freelancers.find(f => f.name === u.name);
                  const isSuspended = u.status === 'Suspended';

                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-white text-xs">{u.name}</p>
                            <p className="text-[11px] text-neutral-400">{u.email}</p>
                            {u.organization && <p className="text-[10px] text-neutral-500">{u.organization}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold uppercase text-[11px]">
                        <span className={
                          u.role === 'admin' ? 'text-purple-400' :
                          u.role === 'client' ? 'text-sky-400' : 'text-indigo-400'
                        }>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400">{u.location}</td>
                      <td className="py-3.5 px-4 text-neutral-400">{u.joinedDate || '2025-11-01'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isSuspended ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {matchingFl && (
                          <button
                            onClick={() => verifyFreelancer(matchingFl.id, !matchingFl.verifiedLocal)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              matchingFl.verifiedLocal
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                            }`}
                          >
                            {matchingFl.verifiedLocal ? 'Verified Local' : 'Verify Talent'}
                          </button>
                        )}

                        {u.role !== 'admin' && (
                          <button
                            onClick={() => updateUserStatus(u.id, isSuspended ? 'Active' : 'Suspended')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              isSuspended
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                            }`}
                          >
                            {isSuspended ? 'Activate' : 'Suspend'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
};
