import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { Save, User, MapPin, Star, ShieldCheck, IndianRupee } from 'lucide-react';
import { SERVICE_CATEGORIES, REGIONS_SERVED } from '../../data/mockData';

export const FreelancerProfilePage: React.FC = () => {
  const { currentUser, freelancers, updateFreelancerProfile, addToast } = useApp();

  const myProfile = freelancers.find(
    f => f.name === currentUser?.name || f.id === currentUser?.id
  ) || freelancers[0];

  const [headline, setHeadline] = useState(myProfile.headline);
  const [bio, setBio] = useState(myProfile.bio);
  const [areaName, setAreaName] = useState(myProfile.areaName);
  const [category, setCategory] = useState(myProfile.category);
  const [startingRate, setStartingRate] = useState(myProfile.startingProjectRateInr.toString());
  const [hourlyRate, setHourlyRate] = useState(myProfile.hourlyRateInr.toString());
  const [availability, setAvailability] = useState(myProfile.availability);
  const [skillsStr, setSkillsStr] = useState(myProfile.skills.join(', '));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFreelancerProfile(myProfile.id, {
      headline,
      bio,
      areaName,
      location: `${areaName}, Palghar Dist.`,
      category: category as any,
      startingProjectRateInr: Number(startingRate),
      hourlyRateInr: Number(hourlyRate),
      availability: availability as any,
      skills: skillsStr.split(',').map(s => s.trim()).filter(Boolean),
    });
    addToast('Profile changes published!', 'Your updated rates and skills are visible to clients.', 'success');
  };

  return (
    <WorkspaceShell
      title="My Profile & Services"
      subtitle="Update your expertise, starting rates, and availability for local business clients"
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6 text-xs">
        <GlassCard className="p-6 bg-white/5 border-white/10 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <img
              src={myProfile.avatar}
              alt={myProfile.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{myProfile.name}</h3>
                {myProfile.verifiedLocal && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase">
                    Verified Local Pro
                  </span>
                )}
              </div>
              <p className="text-neutral-400 text-xs mt-0.5">{myProfile.location}</p>
              <p className="text-[11px] text-amber-400 font-medium mt-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{myProfile.rating} rating from {myProfile.reviewCount} local reviews</span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full-Stack Web & Mobile App Developer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white outline-none"
              >
                {SERVICE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Home Area in Palghar District
              </label>
              <select
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white outline-none"
              >
                {REGIONS_SERVED.map(r => (
                  <option key={r.name} value={r.name}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Starting Project Fee (₹)
              </label>
              <input
                type="number"
                required
                value={startingRate}
                onChange={(e) => setStartingRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Hourly Rate (₹)
              </label>
              <input
                type="number"
                required
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white outline-none"
              >
                <option value="Available Immediately">Available Immediately</option>
                <option value="Part-time Available">Part-time Available</option>
                <option value="Weekends Only">Weekends Only</option>
                <option value="Booked (Available Next Month)">Booked (Available Next Month)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              Skills (Comma-separated)
            </label>
            <input
              type="text"
              required
              value={skillsStr}
              onChange={(e) => setSkillsStr(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              About You & Experience
            </label>
            <textarea
              rows={4}
              required
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
          <span>Publish Profile Updates</span>
        </button>
      </form>
    </WorkspaceShell>
  );
};
