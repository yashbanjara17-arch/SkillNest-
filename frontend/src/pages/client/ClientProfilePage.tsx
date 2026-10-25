import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { Building2, MapPin, Phone, Mail, Save, Loader2 } from 'lucide-react';
import { REGIONS_SERVED } from '../../data/mockData';
import { clientApi, ApiError } from '../../lib/api';

export const ClientProfilePage: React.FC = () => {
  const { currentUser, addToast } = useApp();

  const [businessName, setBusinessName] = useState(currentUser?.organization || '');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [email] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await clientApi.updateProfile({
        name: contactName,
        organization: businessName,
        phone,
        location,
        bio,
      });
      addToast('Profile saved successfully', 'Your business details are up to date.', 'success');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to save profile';
      addToast('Save failed', msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <WorkspaceShell
      title="Business Profile & Details"
      subtitle="Keep your business name and local contact preferences updated for freelancer proposals"
    >
      <form onSubmit={handleSave} className="max-w-2xl space-y-6 text-xs">
        <GlassCard className="p-6 bg-white/5 border-white/10 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={contactName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"
            />
            <div>
              <h3 className="text-base font-bold text-white">{contactName}</h3>
              <p className="text-neutral-400">{businessName}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Verified Business Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Business / Organization Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Cafe Palms / Joshi Precision Forgings"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Your Contact Name
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Phone / WhatsApp Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98234 11223"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Primary Business Location in Maharashtra
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Boisar Station Road / Tarapur MIDC Zone 2"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              About Your Business (Brief introduction for freelancers)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>
        </GlassCard>

        <button
          type="submit"
          className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </WorkspaceShell>
  );
};
