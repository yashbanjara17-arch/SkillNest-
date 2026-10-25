import React, { useState } from 'react';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { useApp } from '../../context/AppContext';
import { Sliders, Save, CheckCircle2, MapPin, Shield } from 'lucide-react';
import { REGIONS_SERVED, SERVICE_CATEGORIES } from '../../data/mockData';

export const AdminSettingsPage: React.FC = () => {
  const { addToast } = useApp();
  const [platformFee, setPlatformFee] = useState('0');
  const [maxSearchRadiusKm, setMaxSearchRadiusKm] = useState('35');
  const [allowInstantInquiries, setAllowInstantInquiries] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Platform settings saved', 'Regional marketplace parameters updated.', 'success');
  };

  return (
    <WorkspaceShell
      title="Platform & Regional Settings"
      subtitle="Configure local marketplace rules, regional hubs, and client communication policies"
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6 text-xs">
        <GlassCard className="p-6 bg-white/5 border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Marketplace Economic Rules</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Platform Commission on Completed Projects (%)
              </label>
              <input
                type="text"
                disabled
                value={platformFee}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold opacity-80"
              />
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                Locked at 0%. SkillNest policy guarantees direct negotiation with zero fees.
              </p>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Max Proximity Search Radius (km)
              </label>
              <input
                type="number"
                value={maxSearchRadiusKm}
                onChange={(e) => setMaxSearchRadiusKm(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Defines the outer perimeter from Boisar railway station.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 bg-white/5 border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span>Active Service Regions in Palghar District</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {REGIONS_SERVED.map((reg) => (
              <div key={reg.name} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-white font-bold text-xs">{reg.name}</p>
                  <p className="text-[10px] text-neutral-400">{reg.description}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <button
          type="submit"
          className="py-2.5 px-5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save Administrative Configuration</span>
        </button>
      </form>
    </WorkspaceShell>
  );
};
