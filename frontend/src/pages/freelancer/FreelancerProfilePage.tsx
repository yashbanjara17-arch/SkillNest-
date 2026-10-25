import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { Modal } from '../../components/common/Modal';
import { FreelancerCard } from '../../components/freelancers/FreelancerCard';
import { FreelancerService, PortfolioItem } from '../../types';
import { 
  Save, 
  User, 
  MapPin, 
  Star, 
  ShieldCheck, 
  IndianRupee, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Layers, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ExternalLink,
  Sparkles,
  Camera,
  Clock,
  Tag
} from 'lucide-react';
import { SERVICE_CATEGORIES, REGIONS_SERVED } from '../../data/mockData';
import { PhotoUpload } from '../../components/common/PhotoUpload';

export const FreelancerProfilePage: React.FC = () => {
  const { 
    currentUser, 
    currentFreelancerProfile, 
    updateFreelancerProfile, 
    addFreelancerService,
    updateFreelancerService,
    deleteFreelancerService,
    addFreelancerPortfolioItem,
    updateFreelancerPortfolioItem,
    deleteFreelancerPortfolioItem,
    addToast 
  } = useApp();

  const myProfile = currentFreelancerProfile || {
    id: `fl-${currentUser?.id}`,
    userId: currentUser?.id,
    name: currentUser?.name || 'Freelancer',
    headline: '',
    bio: '',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    location: currentUser?.location || 'Boisar, Maharashtra',
    areaName: 'Boisar',
    distanceFromBoisarKm: 0,
    isTeam: false,
    teamSize: 2,
    teamMembers: [],
    hourlyRateInr: 0,
    startingProjectRateInr: 0,
    rating: 0,
    reviewCount: 0,
    availability: 'Available Immediately' as const,
    experienceYears: 0,
    category: 'Web & App Development' as const,
    skills: [],
    languages: ['Marathi', 'Hindi', 'English'],
    verifiedLocal: false,
    portfolio: [],
    services: [],
    reviews: [],
    completedProjectsCount: 0,
    contactPreference: 'Phone & WhatsApp' as const,
  };

  // Active tab state
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'services' | 'portfolio' | 'pricing' | 'preview'>('basic');

  // Basic Form State
  const [name, setName] = useState(myProfile.name || '');
  const [avatar, setAvatar] = useState(myProfile.avatar || '');
  const [headline, setHeadline] = useState(myProfile.headline || '');
  const [bio, setBio] = useState(myProfile.bio || '');
  const [areaName, setAreaName] = useState(myProfile.areaName || 'Boisar');
  const [isTeam, setIsTeam] = useState(Boolean(myProfile.isTeam));
  const [teamSize, setTeamSize] = useState(myProfile.teamSize || 2);
  const [teamMembersInput, setTeamMembersInput] = useState((myProfile.teamMembers || []).join(', '));

  // Skills & Categorization
  const [category, setCategory] = useState(myProfile.category || 'Web & App Development');
  const [skillsList, setSkillsList] = useState<string[]>(myProfile.skills || []);
  const [newSkillText, setNewSkillText] = useState('');
  const [experienceYears, setExperienceYears] = useState(myProfile.experienceYears || 0);
  const [contactPreference, setContactPreference] = useState(myProfile.contactPreference || 'Phone & WhatsApp');

  // Pricing & Availability
  const [startingRate, setStartingRate] = useState(myProfile.startingProjectRateInr ? myProfile.startingProjectRateInr.toString() : '');
  const [hourlyRate, setHourlyRate] = useState(myProfile.hourlyRateInr ? myProfile.hourlyRateInr.toString() : '');
  const [availability, setAvailability] = useState(myProfile.availability || 'Available Immediately');
  const [pricingModel, setPricingModel] = useState<'fixed' | 'hourly' | 'indicative'>('indicative');

  // Modals for Service & Portfolio
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDays, setServiceDays] = useState('5');

  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDesc, setPortfolioDesc] = useState('');
  const [portfolioImage, setPortfolioImage] = useState('');
  const [portfolioCategory, setPortfolioCategory] = useState('Web Application');
  const [portfolioClient, setPortfolioClient] = useState('Local Manufacturing');
  const [portfolioSkills, setPortfolioSkills] = useState('React, TypeScript');
  const [portfolioLiveUrl, setPortfolioLiveUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Sync state if profile changes externally
  useEffect(() => {
    if (currentFreelancerProfile) {
      setName(currentFreelancerProfile.name || '');
      setAvatar(currentFreelancerProfile.avatar || '');
      setHeadline(currentFreelancerProfile.headline || '');
      setBio(currentFreelancerProfile.bio || '');
      setAreaName(currentFreelancerProfile.areaName || 'Boisar');
      setIsTeam(Boolean(currentFreelancerProfile.isTeam));
      setTeamSize(currentFreelancerProfile.teamSize || 2);
      setTeamMembersInput((currentFreelancerProfile.teamMembers || []).join(', '));
      setCategory(currentFreelancerProfile.category || 'Web & App Development');
      setSkillsList(currentFreelancerProfile.skills || []);
      setExperienceYears(currentFreelancerProfile.experienceYears || 0);
      setStartingRate(currentFreelancerProfile.startingProjectRateInr ? currentFreelancerProfile.startingProjectRateInr.toString() : '');
      setHourlyRate(currentFreelancerProfile.hourlyRateInr ? currentFreelancerProfile.hourlyRateInr.toString() : '');
      setAvailability(currentFreelancerProfile.availability || 'Available Immediately');
      setContactPreference(currentFreelancerProfile.contactPreference || 'Phone & WhatsApp');
    }
  }, [currentFreelancerProfile]);

  // Profile completion score & checklist
  const completionItems = useMemo(() => {
    return [
      { id: 'headline', label: 'Professional Headline', complete: Boolean(headline.trim()), weight: 15, tab: 'basic' as const },
      { id: 'bio', label: 'About & Introduction', complete: Boolean(bio.trim() && bio.length >= 20), weight: 15, tab: 'basic' as const },
      { id: 'avatar', label: isTeam ? 'Studio Logo' : 'Profile Photo', complete: Boolean(avatar.trim()), weight: 10, tab: 'basic' as const },
      { id: 'skills', label: 'At least 3 Skills', complete: skillsList.length >= 3, weight: 15, tab: 'skills' as const },
      { id: 'services', label: 'Services Offered Listing', complete: myProfile.services.length > 0, weight: 20, tab: 'services' as const },
      { id: 'portfolio', label: 'Portfolio Project Sample', complete: myProfile.portfolio.length > 0, weight: 15, tab: 'portfolio' as const },
      { id: 'rates', label: 'Starting Price & Availability', complete: Number(startingRate) > 0 || Number(hourlyRate) > 0, weight: 10, tab: 'pricing' as const },
    ];
  }, [headline, bio, avatar, isTeam, skillsList, myProfile.services, myProfile.portfolio, startingRate, hourlyRate]);

  const completionPercentage = useMemo(() => {
    return completionItems.reduce((acc, item) => (item.complete ? acc + item.weight : acc), 0);
  }, [completionItems]);

  // Skill tag add/remove
  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = newSkillText.trim();
    if (clean && !skillsList.includes(clean)) {
      setSkillsList([...skillsList, clean]);
      setNewSkillText('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  // Main Save Handler
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const teamMembers = teamMembersInput
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    await updateFreelancerProfile(myProfile.id, {
      name: name.trim() || myProfile.name,
      avatar: avatar.trim() || myProfile.avatar,
      headline: headline.trim(),
      bio: bio.trim(),
      areaName,
      location: `${areaName}, Palghar Dist.`,
      isTeam,
      teamSize: isTeam ? Number(teamSize) : undefined,
      teamMembers: isTeam ? teamMembers : [],
      category: category as any,
      skills: skillsList,
      experienceYears: Number(experienceYears),
      startingProjectRateInr: Number(startingRate) || 0,
      hourlyRateInr: Number(hourlyRate) || 0,
      availability: availability as any,
      contactPreference: contactPreference as any,
    });

    setIsSaving(false);
  };

  // Service Management
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceTitle('');
    setServiceDesc('');
    setServicePrice('15000');
    setServiceDays('7');
    setServiceModalOpen(true);
  };

  const handleOpenEditService = (s: FreelancerService) => {
    setEditingServiceId(s.id);
    setServiceTitle(s.title);
    setServiceDesc(s.description);
    setServicePrice(s.startingPriceInr.toString());
    setServiceDays(s.deliveryTimeDays.toString());
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle.trim()) return;

    if (editingServiceId) {
      await updateFreelancerService(editingServiceId, {
        title: serviceTitle.trim(),
        description: serviceDesc.trim() || 'Professional deliverable tailored to business requirements.',
        startingPriceInr: Number(servicePrice) || 0,
        deliveryTimeDays: Number(serviceDays) || 5,
      });
    } else {
      await addFreelancerService({
        title: serviceTitle.trim(),
        description: serviceDesc.trim() || 'Professional deliverable tailored to business requirements.',
        startingPriceInr: Number(servicePrice) || 0,
        deliveryTimeDays: Number(serviceDays) || 5,
      });
    }

    setServiceModalOpen(false);
  };

  // Portfolio Management
  const handleOpenAddPortfolio = () => {
    setEditingPortfolioId(null);
    setPortfolioTitle('');
    setPortfolioDesc('');
    setPortfolioImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80');
    setPortfolioCategory('Web Application');
    setPortfolioClient('Local Business Partner');
    setPortfolioSkills(skillsList.slice(0, 3).join(', ') || 'React, TypeScript');
    setPortfolioLiveUrl('');
    setPortfolioModalOpen(true);
  };

  const handleOpenEditPortfolio = (p: PortfolioItem) => {
    setEditingPortfolioId(p.id);
    setPortfolioTitle(p.title);
    setPortfolioDesc(p.description);
    setPortfolioImage(p.imageUrl || '');
    setPortfolioCategory(p.category || 'Web Application');
    setPortfolioClient(p.clientType || 'Local Business');
    setPortfolioSkills((p.skillsUsed || []).join(', '));
    setPortfolioLiveUrl(p.liveUrl || '');
    setPortfolioModalOpen(true);
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioTitle.trim()) return;

    const skillsUsed = portfolioSkills.split(',').map(s => s.trim()).filter(Boolean);

    if (editingPortfolioId) {
      await updateFreelancerPortfolioItem(editingPortfolioId, {
        title: portfolioTitle.trim(),
        description: portfolioDesc.trim() || 'Comprehensive project execution delivering measurable results.',
        imageUrl: portfolioImage.trim(),
        category: portfolioCategory,
        clientType: portfolioClient,
        skillsUsed,
        liveUrl: portfolioLiveUrl.trim() || undefined,
      });
    } else {
      await addFreelancerPortfolioItem({
        title: portfolioTitle.trim(),
        description: portfolioDesc.trim() || 'Comprehensive project execution delivering measurable results.',
        imageUrl: portfolioImage.trim(),
        category: portfolioCategory,
        completionYear: '2026',
        clientType: portfolioClient,
        skillsUsed,
        liveUrl: portfolioLiveUrl.trim() || undefined,
      });
    }

    setPortfolioModalOpen(false);
  };

  // Preview object combining saved and current draft values
  const previewFreelancer: any = {
    ...myProfile,
    name: name.trim() || myProfile.name,
    avatar: avatar.trim() || myProfile.avatar,
    headline: headline.trim(),
    bio: bio.trim(),
    location: `${areaName}, Palghar Dist.`,
    areaName,
    isTeam,
    teamSize: isTeam ? Number(teamSize) : undefined,
    teamMembers: isTeam ? teamMembersInput.split(',').map(m => m.trim()).filter(Boolean) : [],
    category: category as any,
    skills: skillsList,
    experienceYears: Number(experienceYears),
    startingProjectRateInr: Number(startingRate) || 0,
    hourlyRateInr: Number(hourlyRate) || 0,
    availability: availability as any,
  };

  return (
    <WorkspaceShell
      title="Freelancer Profile Builder"
      subtitle="Craft a high-trust professional profile with real services, verified portfolio work, and transparent rates"
      action={
        <button
          type="button"
          onClick={() => handleSaveProfile()}
          disabled={isSaving}
          className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing...' : 'Save & Publish Profile'}</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* Profile Strength & Incomplete Checklist Banner */}
        <div className="sn-card-surface rounded-2xl p-5 sm:p-6 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sn-border-subtle border-b">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">Profile Readiness Score</h2>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  completionPercentage >= 85 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' 
                    : completionPercentage >= 50
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}>
                  {completionPercentage}% Complete
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                {completionPercentage >= 85
                  ? 'Your profile has high visibility in client search results across Boisar, Palghar & Tarapur MIDC.'
                  : 'Complete missing sections below to establish trust and attract direct project inquiries.'}
              </p>
            </div>

            <div className="w-full md:w-56 shrink-0 space-y-1.5">
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    completionPercentage >= 85 ? 'bg-emerald-500' : completionPercentage >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                <span>{completionItems.filter(i => i.complete).length} of {completionItems.length} items ready</span>
                <span className="font-semibold">{completionPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Checklist Pills */}
          <div className="pt-4 flex flex-wrap gap-2 text-xs">
            {completionItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.tab)}
                className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] font-medium ${
                  item.complete
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-neutral-100 dark:bg-neutral-800/80 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-indigo-400'
                }`}
              >
                {item.complete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b sn-border-subtle text-xs">
          {[
            { id: 'basic', label: isTeam ? 'Studio & Team Info' : 'Basic Information', icon: isTeam ? Users : User },
            { id: 'skills', label: 'Skills & Expertise', icon: Tag },
            { id: 'services', label: `Services (${myProfile.services.length})`, icon: Briefcase },
            { id: 'portfolio', label: `Portfolio (${myProfile.portfolio.length})`, icon: Layers },
            { id: 'pricing', label: 'Availability & Rates', icon: IndianRupee },
            { id: 'preview', label: 'Public Preview', icon: Eye },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: BASIC INFORMATION & TEAM TOGGLE */}
        {activeTab === 'basic' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="sn-card-surface rounded-2xl p-6 space-y-6">
              {/* Account Type Toggle */}
              <div className="sn-card-subtle p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-xs">Profile Entity Type</h4>
                  <p className="sn-helper text-xs">
                    Choose whether you are representing an individual specialist or a freelance collective/studio.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-neutral-200 dark:bg-neutral-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setIsTeam(false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isTeam ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Individual Freelancer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTeam(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isTeam ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Studio / Team
                  </button>
                </div>
              </div>

              {/* Photo & Display Name */}
              <div className="pb-6 border-b sn-border-subtle space-y-4">
                <div className="max-w-md">
                  <label className="sn-label">
                    {isTeam ? 'Studio / Team Name' : 'Display Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isTeam ? 'e.g. PixelCraft Studio' : 'e.g. Rahul Sharma'}
                    className="sn-input font-bold"
                  />
                </div>

                <PhotoUpload
                  value={avatar}
                  onChange={setAvatar}
                  label={isTeam ? 'Studio / Team Brand Logo' : 'Profile Photo'}
                  helperText={
                    isTeam
                      ? 'Upload your team logo or brand mark directly from your device. JPG, PNG, or WEBP.'
                      : 'Upload a headshot or professional photo directly from your device. JPG, PNG, or WEBP.'
                  }
                  fallbackInitials={(name || 'FL').slice(0, 2).toUpperCase()}
                  shape={isTeam ? 'rounded' : 'circle'}
                  size="lg"
                />
              </div>

              {/* Team specific fields */}
              {isTeam && (
                <div className="sn-card-subtle p-4 rounded-xl space-y-4 border sn-border-subtle">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-bold text-neutral-900 dark:text-white text-xs">Team Roster & Size</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="sn-label">Team Size (Members)</label>
                      <input
                        type="number"
                        min={2}
                        max={50}
                        value={teamSize}
                        onChange={(e) => setTeamSize(Number(e.target.value))}
                        className="sn-input font-bold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="sn-label">Team Members & Roles (Comma-separated)</label>
                      <input
                        type="text"
                        value={teamMembersInput}
                        onChange={(e) => setTeamMembersInput(e.target.value)}
                        placeholder="e.g. Priya Desai (Design Lead), Karan Joshi (Frontend), Meena Rao (Content)"
                        className="sn-input"
                      />
                      <span className="sn-helper">List key team leads and their primary disciplines</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Headline */}
              <div>
                <label className="sn-label">Professional Headline</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={isTeam ? 'e.g. Boutique Creative & Frontend Collective' : 'e.g. Senior Full-Stack Web & Mobile App Developer'}
                  className="sn-input text-xs font-semibold"
                />
                <span className="sn-helper">Appears immediately beneath your name in directory discovery cards</span>
              </div>

              {/* Location Selector */}
              <div>
                <label className="sn-label">Home Area in Palghar District</label>
                <select
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="sn-select font-medium"
                >
                  {REGIONS_SERVED.map(r => (
                    <option key={r.name} value={r.name}>{r.label}</option>
                  ))}
                </select>
                <span className="sn-helper">Helps local clients find professionals close to their offices and MIDC units</span>
              </div>

              {/* Introduction / Bio */}
              <div>
                <label className="sn-label">{isTeam ? 'Studio Introduction & Collective Background' : 'About You & Professional Experience'}</label>
                <textarea
                  rows={4}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your capabilities, notable clients, local industry experience, and why businesses should hire you..."
                  className="sn-textarea"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Basic Information</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SKILLS AND EXPERTISE */}
        {activeTab === 'skills' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="sn-card-surface rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="sn-label">Primary Service Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="sn-select"
                  >
                    {SERVICE_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="sn-label">Years of Professional Experience</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="sn-input font-bold"
                  />
                </div>
              </div>

              {/* Skills Tag Management */}
              <div className="space-y-3">
                <label className="sn-label">Skills & Specialized Tooling</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type a skill and press Enter (e.g. Figma, React, GST Accounting)..."
                    className="sn-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-neutral-900 dark:bg-neutral-800 text-white font-bold rounded-xl text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Add Skill
                  </button>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsList.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-indigo-400 hover:text-rose-500 font-bold ml-0.5 cursor-pointer"
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {skillsList.length === 0 && (
                    <p className="text-xs text-neutral-500 italic">No skills added yet. Add at least 3 skills to make your profile stand out.</p>
                  )}
                </div>
              </div>

              {/* Contact Preference */}
              <div>
                <label className="sn-label">Client Contact Preference</label>
                <select
                  value={contactPreference}
                  onChange={(e) => setContactPreference(e.target.value as any)}
                  className="sn-select"
                >
                  <option value="Phone & WhatsApp">Phone & WhatsApp (Fastest for local deals)</option>
                  <option value="Email & SkillNest Direct">Email & SkillNest Direct Messaging</option>
                  <option value="In-person Meeting First">In-person Meeting First (Local Boisar/Palghar)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Skills & Expertise</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SERVICES OFFERED */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Structured Service Listings</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Provide transparent packages with delivery timelines and starting prices for local clients
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddService}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service Package</span>
              </button>
            </div>

            {myProfile.services.length === 0 ? (
              <div className="sn-card-surface rounded-2xl p-10 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-neutral-400 mx-auto" />
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">No services listed yet</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Listing distinct packages (e.g. Website Development, Brand Identity, SEO Optimization) increases client enquiries by 3x.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddService}
                  className="py-2 px-4 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Create First Service
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myProfile.services.map((srv) => (
                  <div key={srv.id} className="sn-card-surface rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-neutral-900 dark:text-white text-sm">{srv.title}</h4>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditService(srv)}
                            className="p-1.5 text-neutral-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit Service"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteFreelancerService(srv.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t sn-border-subtle flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{srv.deliveryTimeDays} Days Delivery</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block text-right">Starting At</span>
                        <span className="font-extrabold text-neutral-900 dark:text-white tabular-nums text-sm">
                          ₹{srv.startingPriceInr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PORTFOLIO & WORK */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Portfolio Projects & Deliverables</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Showcase real work samples, deliverables, and case studies to local clients
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddPortfolio}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Work Sample</span>
              </button>
            </div>

            {myProfile.portfolio.length === 0 ? (
              <div className="sn-card-surface rounded-2xl p-10 text-center space-y-3">
                <Layers className="w-10 h-10 text-neutral-400 mx-auto" />
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">No portfolio items added</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Adding work samples helps clients verify your craft before requesting a quote.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddPortfolio}
                  className="py-2 px-4 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 cursor-pointer"
                >
                  Upload First Sample
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProfile.portfolio.map((item) => (
                  <div key={item.id} className="sn-card-surface rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="h-40 overflow-hidden relative bg-neutral-100 dark:bg-neutral-800">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-neutral-900 dark:text-white text-sm line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(item.skillsUsed || []).map(s => (
                            <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-3 border-t sn-border-subtle flex items-center justify-between text-xs">
                      <span className="text-[11px] text-neutral-500">Client: {item.clientType || 'Local'}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPortfolio(item)}
                          className="p-1.5 text-neutral-400 hover:text-indigo-600 rounded-lg cursor-pointer"
                          title="Edit sample"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFreelancerPortfolioItem(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-500 rounded-lg cursor-pointer"
                          title="Remove sample"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PRICING & AVAILABILITY */}
        {activeTab === 'pricing' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="sn-card-surface rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="sn-label">Starting Project Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={startingRate}
                    onChange={(e) => setStartingRate(e.target.value)}
                    placeholder="e.g. 15000"
                    className="sn-input font-bold"
                  />
                  <span className="sn-helper">Minimum engagement threshold for custom projects</span>
                </div>

                <div>
                  <label className="sn-label">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="e.g. 1000"
                    className="sn-input font-bold"
                  />
                  <span className="sn-helper">For consulting or direct time-and-materials work</span>
                </div>

                <div>
                  <label className="sn-label">Availability Status</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="sn-select"
                  >
                    <option value="Available Immediately">Available Immediately</option>
                    <option value="Part-time Available">Part-time Available</option>
                    <option value="Weekends Only">Weekends Only</option>
                    <option value="Booked (Available Next Month)">Booked (Available Next Month)</option>
                  </select>
                  <span className="sn-helper">Displayed to clients looking for immediate turnaround</span>
                </div>
              </div>

              {/* Pricing Structure Indicator */}
              <div className="sn-card-subtle p-4 rounded-xl space-y-2 border sn-border-subtle">
                <label className="sn-label">Pricing Structure Model</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'indicative', title: 'Indicative / Starting Rate', desc: 'Final quotes determined after requirement review' },
                    { id: 'fixed', title: 'Fixed Deliverable Fee', desc: 'Pre-defined pricing per project scope' },
                    { id: 'hourly', title: 'Hourly Dedicated', desc: 'Billed strictly by tracked consulting hours' },
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setPricingModel(m.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        pricingModel === m.id
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-neutral-900 dark:text-white'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <p className="text-xs font-bold">{m.title}</p>
                      <p className="text-[11px] text-neutral-500 mt-1">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Pricing & Availability</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 6: PUBLIC PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="sn-card-surface rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Directory Discovery Card Preview</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  This is exactly how local business clients will see your listing in search results:
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <FreelancerCard freelancer={previewFreelancer} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SERVICE MODAL */}
      <Modal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingServiceId ? 'Edit Service Package' : 'Create Service Package'}
      >
        <form onSubmit={handleSaveService} className="space-y-4 text-xs">
          <div>
            <label className="sn-label">Service Title</label>
            <input
              type="text"
              required
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              placeholder="e.g. Modern Responsive Business Website"
              className="sn-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sn-label">Starting Price (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                placeholder="15000"
                className="sn-input font-bold"
              />
            </div>
            <div>
              <label className="sn-label">Turnaround Time (Days)</label>
              <input
                type="number"
                required
                min={1}
                value={serviceDays}
                onChange={(e) => setServiceDays(e.target.value)}
                placeholder="7"
                className="sn-input"
              />
            </div>
          </div>

          <div>
            <label className="sn-label">Deliverables & Scope Description</label>
            <textarea
              rows={3}
              required
              value={serviceDesc}
              onChange={(e) => setServiceDesc(e.target.value)}
              placeholder="Explain key deliverables included in this price (e.g. 5 responsive pages, WhatsApp button, speed optimization)..."
              className="sn-textarea"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t sn-border-subtle">
            <button
              type="button"
              onClick={() => setServiceModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
            >
              Save Service
            </button>
          </div>
        </form>
      </Modal>

      {/* PORTFOLIO MODAL */}
      <Modal
        isOpen={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        title={editingPortfolioId ? 'Edit Work Sample' : 'Add Work Sample to Portfolio'}
      >
        <form onSubmit={handleSavePortfolio} className="space-y-4 text-xs">
          <div>
            <label className="sn-label">Project Title</label>
            <input
              type="text"
              required
              value={portfolioTitle}
              onChange={(e) => setPortfolioTitle(e.target.value)}
              placeholder="e.g. Tarapur MIDC Chemical Inventory Portal"
              className="sn-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sn-label">Category</label>
              <input
                type="text"
                required
                value={portfolioCategory}
                onChange={(e) => setPortfolioCategory(e.target.value)}
                placeholder="e.g. Web Application"
                className="sn-input"
              />
            </div>
            <div>
              <label className="sn-label">Client Type</label>
              <input
                type="text"
                required
                value={portfolioClient}
                onChange={(e) => setPortfolioClient(e.target.value)}
                placeholder="e.g. Manufacturing MSME"
                className="sn-input"
              />
            </div>
          </div>

          <div>
            <PhotoUpload
              value={portfolioImage}
              onChange={setPortfolioImage}
              label="Work Sample Screenshot / Image"
              helperText="Upload a screenshot, mockup, or preview image directly from your device."
              fallbackInitials="WORK"
              shape="rounded"
              size="md"
            />
          </div>

          <div>
            <label className="sn-label">Description & Business Outcome</label>
            <textarea
              rows={3}
              required
              value={portfolioDesc}
              onChange={(e) => setPortfolioDesc(e.target.value)}
              placeholder="What was built, how it helped the client, and technologies utilized..."
              className="sn-textarea"
            />
          </div>

          <div>
            <label className="sn-label">Skills / Technologies Used (Comma-separated)</label>
            <input
              type="text"
              value={portfolioSkills}
              onChange={(e) => setPortfolioSkills(e.target.value)}
              placeholder="React, Tailwind, Node.js"
              className="sn-input"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t sn-border-subtle">
            <button
              type="button"
              onClick={() => setPortfolioModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
            >
              Save Project Sample
            </button>
          </div>
        </form>
      </Modal>
    </WorkspaceShell>
  );
};
