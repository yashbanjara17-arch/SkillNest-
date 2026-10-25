import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { Building2, MapPin, Phone, Mail, Save, Loader2 } from 'lucide-react';
import { REGIONS_SERVED } from '../../data/mockData';
import { ApiError } from '../../lib/api';
import { PhotoUpload } from '../../components/common/PhotoUpload';

export const ClientProfilePage: React.FC = () => {
  const { currentUser, addToast, updateClientProfile } = useApp();

  const [businessName, setBusinessName] = useState(currentUser?.organization || '');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [email] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateClientProfile({
        name: contactName,
        organization: businessName,
        phone,
        location,
        bio,
        avatarUrl: avatar,
      });
      addToast('Profile saved successfully', 'Your business details and photo are up to date.', 'success');
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
        <div className="sn-card-surface rounded-2xl p-6 space-y-6">
          {/* Direct Photo Upload */}
          <div className="pb-4 border-b sn-border-subtle">
            <PhotoUpload
              value={avatar}
              onChange={setAvatar}
              label="Business Logo or Contact Photo"
              helperText="Upload your company logo or profile picture directly from your device. JPG, PNG, or WEBP."
              fallbackInitials={(contactName || businessName || 'CL').slice(0, 2).toUpperCase()}
              shape="rounded"
              size="lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="sn-label">
                Business / Organization Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Cafe Palms / Joshi Precision Forgings"
                className="sn-input"
              />
            </div>

            <div>
              <label className="sn-label">
                Your Contact Name
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="sn-input font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="sn-label">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="sn-input opacity-70 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="sn-label">
                Phone / WhatsApp Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98234 11223"
                className="sn-input"
              />
            </div>
          </div>

          <div>
            <label className="sn-label">
              Primary Business Location in Maharashtra
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Boisar Station Road / Tarapur MIDC Zone 2"
              className="sn-input"
            />
          </div>

          <div>
            <label className="sn-label">
              About Your Business (Brief introduction for freelancers)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief description of your business and project needs..."
              className="sn-textarea"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>
    </WorkspaceShell>
  );
};
