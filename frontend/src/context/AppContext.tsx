import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Freelancer, FreelancerService, PortfolioItem, Project, Proposal, DirectInquiry, User, UserRole, ToastMessage } from '../types';
import { INITIAL_USERS, INITIAL_FREELANCERS, INITIAL_PROJECTS } from '../data/mockData';
import { authApi, freelancersApi, projectsApi, proposalsApi, inquiriesApi, savedApi, adminApi, clientApi } from '../lib/api';

const availabilityToBackend: Record<string, string> = {
  'Available Immediately': 'AvailableImmediately',
  'Part-time Available': 'PartTimeAvailable',
  'Booked (Available Next Month)': 'BookedAvailableNextMonth',
  'Weekends Only': 'WeekendsOnly',
};

const categoryToBackend: Record<string, string> = {
  'Web & App Development': 'WebAndAppDevelopment',
  'UI/UX & Graphic Design': 'UIUXAndGraphicDesign',
  'Digital Marketing & SEO': 'DigitalMarketingAndSEO',
  'Video & Media Production': 'VideoAndMediaProduction',
  'Industrial & CAD Engineering': 'IndustrialAndCADEngineering',
  'Content & Copywriting': 'ContentAndCopywriting',
};

const availabilityFromBackend: Record<string, 'Available Immediately' | 'Part-time Available' | 'Booked (Available Next Month)' | 'Weekends Only'> = {
  AvailableImmediately: 'Available Immediately',
  PartTimeAvailable: 'Part-time Available',
  BookedAvailableNextMonth: 'Booked (Available Next Month)',
  WeekendsOnly: 'Weekends Only',
};

const categoryFromBackend: Record<string, 'Web & App Development' | 'UI/UX & Graphic Design' | 'Digital Marketing & SEO' | 'Video & Media Production' | 'Industrial & CAD Engineering' | 'Content & Copywriting'> = {
  WebAndAppDevelopment: 'Web & App Development',
  UIUXAndGraphicDesign: 'UI/UX & Graphic Design',
  DigitalMarketingAndSEO: 'Digital Marketing & SEO',
  VideoAndMediaProduction: 'Video & Media Production',
  IndustrialAndCADEngineering: 'Industrial & CAD Engineering',
  ContentAndCopywriting: 'Content & Copywriting',
};

function createFreelancerFromData(user: User, data?: any): Freelancer {
  const cat = data?.category ? (categoryFromBackend[data.category] || data.category) : 'Web & App Development';
  const avail = data?.availability ? (availabilityFromBackend[data.availability] || data.availability) : 'Available Immediately';

  return {
    id: data?.id || `fl-${user.id}`,
    userId: data?.userId || user.id,
    name: data?.name || user.name,
    headline: data?.headline || '',
    bio: data?.bio || user.bio || '',
    avatar: data?.avatar || data?.avatarUrl || user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    location: data?.location || user.location || 'Boisar, Maharashtra',
    areaName: data?.areaName || 'Boisar',
    distanceFromBoisarKm: data?.distanceFromBoisarKm || 0,
    isTeam: Boolean(data?.isTeam),
    teamSize: data?.teamSize,
    teamMembers: data?.teamMembers || data?.teamMemberNames || [],
    hourlyRateInr: data?.hourlyRateInr || 0,
    startingProjectRateInr: data?.startingProjectRateInr || 0,
    rating: data?.rating || 0,
    reviewCount: data?.reviewCount || 0,
    availability: avail,
    experienceYears: data?.experienceYears || 0,
    category: cat,
    skills: data?.skills || [],
    languages: data?.languages || ['Marathi', 'Hindi', 'English'],
    verifiedLocal: Boolean(data?.verifiedLocal),
    portfolio: data?.portfolio || [],
    services: data?.services || [],
    reviews: data?.reviews || [],
    completedProjectsCount: data?.completedProjectsCount || 0,
    contactPreference: data?.contactPreference || 'Phone & WhatsApp',
  };
}

interface AppContextType {
  currentUser: User | null;
  currentFreelancerProfile: Freelancer | null;
  users: User[];
  freelancers: Freelancer[];
  projects: Project[];
  proposals: Proposal[];
  inquiries: DirectInquiry[];
  savedFreelancerIds: string[];
  savedProjectIds: string[];
  toasts: ToastMessage[];
  isLoadingAuth: boolean;
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  login: (email: string, role: UserRole, name?: string, userId?: string) => void;
  logout: () => void;
  postProject: (newProject: Omit<Project, 'id' | 'postedDate' | 'status' | 'proposalsCount' | 'clientId' | 'clientName'>) => string;
  submitProposal: (projectId: string, priceInr: number, timeline: string, message: string) => void;
  sendInquiry: (freelancerId: string, projectTitle: string, message: string, budgetInr?: number, meetingPref?: 'In-person (Local)' | 'Phone Call' | 'Video Meeting') => void;
  replyToInquiry: (inquiryId: string, message: string) => void;
  toggleSaveFreelancer: (freelancerId: string) => void;
  toggleSaveProject: (projectId: string) => void;
  updateFreelancerProfile: (freelancerId: string, updates: Partial<Freelancer>) => Promise<void>;
  updateClientProfile: (updates: { name?: string; organization?: string; phone?: string; location?: string; bio?: string; avatarUrl?: string }) => Promise<void>;
  addFreelancerService: (service: Omit<FreelancerService, 'id'>) => Promise<FreelancerService | null>;
  updateFreelancerService: (serviceId: string, updates: Partial<FreelancerService>) => Promise<void>;
  deleteFreelancerService: (serviceId: string) => Promise<void>;
  addFreelancerPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => Promise<PortfolioItem | null>;
  updateFreelancerPortfolioItem: (itemId: string, updates: Partial<PortfolioItem>) => Promise<void>;
  deleteFreelancerPortfolioItem: (itemId: string) => Promise<void>;
  updateProjectStatus: (projectId: string, status: Project['status']) => void;
  updateProposalStatus: (proposalId: string, status: Proposal['status']) => void;
  deleteProject: (projectId: string) => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
  verifyFreelancer: (freelancerId: string, verified: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentFreelancerProfile, setCurrentFreelancerProfile] = useState<Freelancer | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [freelancers, setFreelancers] = useState<Freelancer[]>(INITIAL_FREELANCERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [inquiries, setInquiries] = useState<DirectInquiry[]>([]);
  const [savedFreelancerIds, setSavedFreelancerIds] = useState<string[]>([]);
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const syncUserData = useCallback((u: User) => {
    if (u.role === 'freelancer') {
      setCurrentFreelancerProfile(createFreelancerFromData(u));
      freelancersApi.getMe().then((res) => {
        if (res.success && res.data) {
          setCurrentFreelancerProfile(createFreelancerFromData(u, res.data));
        }
      }).catch(() => {});

      proposalsApi.myProposals().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setProposals(res.data as Proposal[]);
        }
      }).catch(() => {});
    }

    if (u.role === 'client') {
      projectsApi.mine().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setProjects((prev) => {
            const realIds = new Set((res.data as any[]).map((p) => p.id));
            return [...(res.data as Project[]), ...prev.filter((p) => !realIds.has(p.id))];
          });
        }
      }).catch(() => {});
    }

    inquiriesApi.mine().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setInquiries(res.data as DirectInquiry[]);
      }
    }).catch(() => {});

    savedApi.getIds().then((savedRes) => {
      if (savedRes.success && savedRes.data) {
        setSavedFreelancerIds(savedRes.data.savedFreelancerIds || []);
        setSavedProjectIds(savedRes.data.savedProjectIds || []);
      }
    }).catch(() => {});
  }, []);

  // ── Session Restoration & Data Sync ─────────────────────────────────────
  useEffect(() => {
    authApi.me()
      .then((res) => {
        if (res.success && res.data) {
          const u = res.data as Record<string, unknown>;
          const userObj: User = {
            id: u.id as string,
            name: u.name as string,
            email: u.email as string,
            role: u.role as UserRole,
            avatar: (u.avatarUrl as string) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            location: (u.location as string) || 'Boisar, Maharashtra',
            bio: u.bio as string | undefined,
            organization: (u.clientProfile as any)?.organization || undefined,
            status: (u.status as User['status']) || 'Active',
          };
          setCurrentUser(userObj);
          syncUserData(userObj);
        }
      })
      .catch(() => { /* Not authenticated */ })
      .finally(() => setIsLoadingAuth(false));

    // Load real freelancers from backend for marketplace directory
    freelancersApi.list().then((res) => {
      if (res.success && Array.isArray(res.items) && res.items.length > 0) {
        setFreelancers(res.items.map((item: any) => ({
          ...item,
          category: categoryFromBackend[item.category] || item.category || 'Web & App Development',
          availability: availabilityFromBackend[item.availability] || item.availability || 'Available Immediately',
        })) as Freelancer[]);
      }
    }).catch(() => {});
  }, [syncUserData]);

  const addToast = useCallback((title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Called after successful API login/register
  const login = useCallback((email: string, role: UserRole, name?: string, userId?: string) => {
    const newUser: User = {
      id: userId || `user-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      location: 'Boisar, Maharashtra',
      status: 'Active',
    };
    setCurrentUser(newUser);
    syncUserData(newUser);
  }, [syncUserData]);

  const logout = useCallback(async () => {
    const name = currentUser?.name;
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    setCurrentUser(null);
    setCurrentFreelancerProfile(null);
    setSavedFreelancerIds([]);
    setSavedProjectIds([]);
    setProposals([]);
    setInquiries([]);
    addToast('Signed out', name ? `Goodbye, ${name}` : 'You have been signed out', 'info');
  }, [currentUser, addToast]);

  const postProject = useCallback((
    newProject: Omit<Project, 'id' | 'postedDate' | 'status' | 'proposalsCount' | 'clientId' | 'clientName'>
  ): string => {
    const newId = `proj-${Date.now()}`;
    const fullProject: Project = {
      ...newProject,
      id: newId,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      proposalsCount: 0,
      clientId: currentUser?.id || 'guest-client',
      clientName: currentUser?.name || 'Local Business Client',
      clientOrganization: currentUser?.organization || 'Private Enterprise',
    };
    setProjects((prev) => [fullProject, ...prev]);

    // Persist to backend API if authenticated
    if (currentUser?.id) {
      projectsApi.create({
        title: newProject.title,
        category: newProject.category,
        description: newProject.description,
        requiredSkills: newProject.requiredSkills,
        clientLocation: newProject.clientLocation,
        preferredArea: newProject.preferredArea,
        budgetMinInr: newProject.budgetMinInr,
        budgetMaxInr: newProject.budgetMaxInr,
        isBudgetNegotiable: newProject.isBudgetNegotiable,
        timeline: newProject.timeline,
        preferredWorkerType: newProject.preferredWorkerType === 'Individual Freelancer'
          ? 'IndividualFreelancer'
          : newProject.preferredWorkerType === 'Agency / Freelance Team'
          ? 'AgencyFreelanceTeam'
          : 'Any',
        contactPreference: newProject.contactPreference,
      }).then((res) => {
        if (res.success && res.data) {
          const created = res.data as { id?: string };
          if (created.id) {
            setProjects((prev) => prev.map((p) => (p.id === newId ? { ...p, id: created.id! } : p)));
          }
        }
      }).catch((err) => {
        console.warn('Backend project persistence deferred:', err);
      });
    }

    addToast('Project published successfully!', 'Local freelancers will be notified.', 'success');
    return newId;
  }, [currentUser, addToast]);

  const submitProposal = useCallback((projectId: string, priceInr: number, timeline: string, message: string) => {
    const flProfile = currentFreelancerProfile;
    const flId = flProfile?.id || currentUser?.id || 'unknown';
    const flName = currentUser?.name || flProfile?.name || 'Freelancer';
    const flAvatar = currentUser?.avatar || flProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    const flHeadline = flProfile?.headline || 'Professional Freelancer';
    const flLocation = currentUser?.location || flProfile?.location || 'Boisar, Maharashtra';

    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      projectId,
      freelancerId: flId,
      freelancerName: flName,
      freelancerAvatar: flAvatar,
      freelancerHeadline: flHeadline,
      freelancerLocation: flLocation,
      proposedPriceInr: priceInr,
      estimatedTimeline: timeline,
      coverMessage: message,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setProposals((prev) => [newProp, ...prev]);
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, proposalsCount: p.proposalsCount + 1 } : p))
    );

    // Persist to backend API
    proposalsApi.submit(projectId, {
      proposedPriceInr: priceInr,
      estimatedTimeline: timeline,
      coverMessage: message,
    }).catch((err) => {
      console.warn('Backend proposal persistence deferred:', err);
    });

    addToast('Proposal submitted!', 'The business owner has received your solution pitch.', 'success');
  }, [currentUser, currentFreelancerProfile, addToast]);

  const sendInquiry = useCallback((
    freelancerId: string,
    projectTitle: string,
    message: string,
    budgetInr?: number,
    meetingPref: 'In-person (Local)' | 'Phone Call' | 'Video Meeting' = 'In-person (Local)'
  ) => {
    const targetFl = freelancers.find((f) => f.id === freelancerId);
    const newInquiry: DirectInquiry = {
      id: `inq-${Date.now()}`,
      freelancerId,
      clientId: currentUser?.id || 'guest-client',
      clientName: currentUser?.name || 'Local Business Owner',
      clientEmail: currentUser?.email || 'client@business.local',
      projectTitle,
      initialMessage: message,
      proposedBudgetInr: budgetInr,
      meetingPreference: meetingPref,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Unread',
      replies: [],
    };
    setInquiries((prev) => [newInquiry, ...prev]);

    // Persist to backend API
    const pref = meetingPref === 'Phone Call' ? 'PhoneCall' : meetingPref === 'Video Meeting' ? 'VideoMeeting' : 'InPersonLocal';
    inquiriesApi.create({
      freelancerId,
      projectTitle,
      initialMessage: message,
      proposedBudgetInr: budgetInr,
      meetingPreference: pref,
    }).then(() => {
      inquiriesApi.mine().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setInquiries(res.data as DirectInquiry[]);
        }
      }).catch(() => {});
    }).catch((err) => {
      console.warn('Backend inquiry persistence deferred:', err);
    });

    addToast('Direct enquiry dispatched!', `Delivered to ${targetFl?.name || 'freelancer'}.`, 'success');
  }, [currentUser, freelancers, addToast]);

  const replyToInquiry = useCallback((inquiryId: string, message: string) => {
    const sender = currentUser?.name || 'User';
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === inquiryId) {
          return {
            ...inq,
            status: 'Replied' as const,
            replies: [
              ...(inq.replies || []),
              {
                senderId: currentUser?.id || 'curr-user',
                senderName: sender,
                message,
                sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              },
            ],
          };
        }
        return inq;
      })
    );

    // Persist to backend API
    inquiriesApi.sendMessage(inquiryId, message).then(() => {
      inquiriesApi.mine().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setInquiries(res.data as DirectInquiry[]);
        }
      }).catch(() => {});
    }).catch((err) => {
      console.warn('Backend message persistence deferred:', err);
    });

    addToast('Message reply sent', 'Added to conversation thread', 'info');
  }, [currentUser, addToast]);

  const toggleSaveFreelancer = useCallback((id: string) => {
    const isSaved = savedFreelancerIds.includes(id);
    setSavedFreelancerIds((prev) => (isSaved ? prev.filter((x) => x !== id) : [...prev, id]));
    savedApi.toggleFreelancer(id).catch(() => {});
    addToast(isSaved ? 'Removed from bookmarks' : 'Saved to your shortlist', undefined, 'info');
  }, [savedFreelancerIds, addToast]);

  const toggleSaveProject = useCallback((id: string) => {
    const isSaved = savedProjectIds.includes(id);
    setSavedProjectIds((prev) => (isSaved ? prev.filter((x) => x !== id) : [...prev, id]));
    savedApi.toggleProject(id).catch(() => {});
    addToast(isSaved ? 'Project removed from saved' : 'Project saved to bookmarks', undefined, 'info');
  }, [savedProjectIds, addToast]);

  const updateFreelancerProfile = useCallback(async (freelancerId: string, updates: Partial<Freelancer>) => {
    setCurrentFreelancerProfile((prev) => (prev ? { ...prev, ...updates } : null));

    if (updates.name || updates.avatar) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...(updates.name ? { name: updates.name } : {}),
          ...(updates.avatar ? { avatar: updates.avatar } : {}),
          ...(updates.location ? { location: updates.location } : {}),
          ...(updates.bio ? { bio: updates.bio } : {}),
        };
      });
    }

    setFreelancers((prev) => {
      const exists = prev.some((f) => f.id === freelancerId || (currentUser?.id && f.userId === currentUser.id));
      if (exists) {
        return prev.map((f) =>
          f.id === freelancerId || (currentUser?.id && f.userId === currentUser.id) ? { ...f, ...updates } : f
        );
      } else if (currentFreelancerProfile) {
        return [{ ...currentFreelancerProfile, ...updates }, ...prev];
      }
      return prev;
    });

    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.avatar !== undefined) payload.avatarUrl = updates.avatar;
    if (updates.headline !== undefined) payload.headline = updates.headline;
    if (updates.bio !== undefined) payload.bio = updates.bio;
    if (updates.areaName !== undefined) payload.areaName = updates.areaName;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.isTeam !== undefined) payload.isTeam = updates.isTeam;
    if (updates.teamSize !== undefined) payload.teamSize = updates.teamSize;
    if (updates.teamMembers !== undefined) payload.teamMemberNames = updates.teamMembers;
    if (updates.startingProjectRateInr !== undefined) payload.startingProjectRateInr = Number(updates.startingProjectRateInr);
    if (updates.hourlyRateInr !== undefined) payload.hourlyRateInr = Number(updates.hourlyRateInr);
    if (updates.experienceYears !== undefined) payload.experienceYears = Number(updates.experienceYears);
    if (updates.skills !== undefined) payload.skills = updates.skills;
    if (updates.languages !== undefined) payload.languages = updates.languages;

    if (updates.availability && availabilityToBackend[updates.availability]) {
      payload.availability = availabilityToBackend[updates.availability];
    }
    if (updates.category && categoryToBackend[updates.category]) {
      payload.category = categoryToBackend[updates.category];
    }

    try {
      const res = await freelancersApi.updateMe(payload);
      if (res.success && res.data) {
        if (currentUser) {
          const fresh = createFreelancerFromData(currentUser, res.data);
          setCurrentFreelancerProfile(fresh);
          setFreelancers((prev) =>
            prev.map((f) => (f.id === fresh.id || f.id === freelancerId ? fresh : f))
          );
        }
      }
    } catch (err) {
      console.warn('Backend freelancer profile update deferred:', err);
    }
    addToast('Profile updated', 'Changes have been saved and published', 'success');
  }, [currentUser, currentFreelancerProfile, addToast]);

  const updateClientProfile = useCallback(
    async (updates: { name?: string; organization?: string; phone?: string; location?: string; bio?: string; avatarUrl?: string }) => {
      setCurrentUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...(updates.name !== undefined ? { name: updates.name } : {}),
          ...(updates.organization !== undefined ? { organization: updates.organization } : {}),
          ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
          ...(updates.location !== undefined ? { location: updates.location } : {}),
          ...(updates.bio !== undefined ? { bio: updates.bio } : {}),
          ...(updates.avatarUrl !== undefined ? { avatar: updates.avatarUrl } : {}),
        };
      });

      try {
        const res = await clientApi.updateProfile(updates);
        if (res.data) {
          const u = res.data as any;
          setCurrentUser((prev) =>
            prev
              ? {
                  ...prev,
                  name: u.name || prev.name,
                  avatar: u.avatarUrl || prev.avatar,
                  phone: u.phone || prev.phone,
                  location: u.location || prev.location,
                  bio: u.bio || prev.bio,
                  organization: u.clientProfile?.organization || prev.organization,
                }
              : null
          );
        }
      } catch (err) {
        console.warn('Backend client profile update error:', err);
        throw err;
      }
    },
    []
  );

  const addFreelancerService = useCallback(
    async (service: Omit<FreelancerService, 'id'>): Promise<FreelancerService | null> => {
      const tempId = `srv-${Date.now()}`;
      const newService: FreelancerService = { ...service, id: tempId };

      setCurrentFreelancerProfile((prev) => (prev ? { ...prev, services: [...prev.services, newService] } : null));
      setFreelancers((prev) =>
        prev.map((f) =>
          f.id === currentFreelancerProfile?.id ? { ...f, services: [...f.services, newService] } : f
        )
      );

      try {
        const res = await freelancersApi.addService({
          title: service.title,
          description: service.description,
          startingPriceInr: service.startingPriceInr,
          deliveryTimeDays: service.deliveryTimeDays,
        });
        if (res.success && res.data) {
          const saved = res.data as FreelancerService;
          setCurrentFreelancerProfile((prev) =>
            prev ? { ...prev, services: prev.services.map((s) => (s.id === tempId ? saved : s)) } : null
          );
          setFreelancers((prev) =>
            prev.map((f) =>
              f.id === currentFreelancerProfile?.id
                ? { ...f, services: f.services.map((s) => (s.id === tempId ? saved : s)) }
                : f
            )
          );
          addToast('Service listing added', 'New service is live on your profile', 'success');
          return saved;
        }
      } catch (err) {
        console.warn('Service persistence error:', err);
      }
      addToast('Service listing added', 'New service is visible on your profile', 'success');
      return newService;
    },
    [currentFreelancerProfile?.id, addToast]
  );

  const updateFreelancerService = useCallback(
    async (serviceId: string, updates: Partial<FreelancerService>) => {
      setCurrentFreelancerProfile((prev) =>
        prev ? { ...prev, services: prev.services.map((s) => (s.id === serviceId ? { ...s, ...updates } : s)) } : null
      );
      setFreelancers((prev) =>
        prev.map((f) =>
          f.id === currentFreelancerProfile?.id
            ? { ...f, services: f.services.map((s) => (s.id === serviceId ? { ...s, ...updates } : s)) }
            : f
        )
      );

      try {
        await freelancersApi.updateService(serviceId, updates);
        addToast('Service updated', 'Changes have been saved', 'success');
      } catch (err) {
        console.warn('Service update deferred:', err);
      }
    },
    [currentFreelancerProfile?.id, addToast]
  );

  const deleteFreelancerService = useCallback(
    async (serviceId: string) => {
      setCurrentFreelancerProfile((prev) =>
        prev ? { ...prev, services: prev.services.filter((s) => s.id !== serviceId) } : null
      );
      setFreelancers((prev) =>
        prev.map((f) =>
          f.id === currentFreelancerProfile?.id
            ? { ...f, services: f.services.filter((s) => s.id !== serviceId) }
            : f
        )
      );

      try {
        await freelancersApi.deleteService(serviceId);
        addToast('Service removed', undefined, 'info');
      } catch (err) {
        console.warn('Service deletion deferred:', err);
      }
    },
    [currentFreelancerProfile?.id, addToast]
  );

  const addFreelancerPortfolioItem = useCallback(
    async (item: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem | null> => {
      const tempId = `port-${Date.now()}`;
      const newItem: PortfolioItem = { ...item, id: tempId };

      setCurrentFreelancerProfile((prev) => (prev ? { ...prev, portfolio: [newItem, ...prev.portfolio] } : null));
      setFreelancers((prev) =>
        prev.map((f) =>
          f.id === currentFreelancerProfile?.id ? { ...f, portfolio: [newItem, ...f.portfolio] } : f
        )
      );

      try {
        const res = await freelancersApi.addPortfolio({
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
          completionYear: item.completionYear,
          clientType: item.clientType,
          skillsUsed: item.skillsUsed,
          liveUrl: item.liveUrl,
        });
        if (res.success && res.data) {
          const saved = res.data as PortfolioItem;
          setCurrentFreelancerProfile((prev) =>
            prev ? { ...prev, portfolio: prev.portfolio.map((p) => (p.id === tempId ? saved : p)) } : null
          );
          setFreelancers((prev) =>
            prev.map((f) =>
              f.id === currentFreelancerProfile?.id
                ? { ...f, portfolio: f.portfolio.map((p) => (p.id === tempId ? saved : p)) }
                : f
            )
          );
          addToast('Portfolio item added', 'Showcased on your public profile', 'success');
          return saved;
        }
      } catch (err) {
        console.warn('Portfolio persistence error:', err);
      }
      addToast('Portfolio item added', 'Showcased on your profile', 'success');
      return newItem;
    },
    [currentFreelancerProfile?.id, addToast]
  );

  const updateFreelancerPortfolioItem = useCallback(
    async (itemId: string, updates: Partial<PortfolioItem>) => {
      setCurrentFreelancerProfile((prev) =>
        prev ? { ...prev, portfolio: prev.portfolio.map((p) => (p.id === itemId ? { ...p, ...updates } : p)) } : null
      );
      setFreelancers((prev) =>
        prev.map((f) =>
          f.id === currentFreelancerProfile?.id
            ? { ...f, portfolio: f.portfolio.map((p) => (p.id === itemId ? { ...p, ...updates } : p)) }
            : f
        )
      );

      try {
        await freelancersApi.updatePortfolio(itemId, updates);
        addToast('Portfolio item updated', 'Changes have been saved', 'success');
      } catch (err) {
        console.warn('Portfolio update deferred:', err);
      }
    },
    [currentFreelancerProfile?.id, addToast]
  );

  const deleteFreelancerPortfolioItem = useCallback(
    async (itemId: string) => {
      setCurrentFreelancerProfile((prev) =>
        prev ? { ...prev, portfolio: prev.portfolio.filter((p) => p.id !== itemId) } : null
      );
      setFreelancers((prev) =>
        prev.map((f) =>
          f.id === currentFreelancerProfile?.id
            ? { ...f, portfolio: f.portfolio.filter((p) => p.id !== itemId) }
            : f
        )
      );

      try {
        await freelancersApi.deletePortfolio(itemId);
        addToast('Portfolio item removed', undefined, 'info');
      } catch (err) {
        console.warn('Portfolio deletion deferred:', err);
      }
    },
    [currentFreelancerProfile?.id, addToast]
  );

  const updateProjectStatus = useCallback((projectId: string, status: Project['status']) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status } : p)));
    const statusMap: Record<string, string> = {
      'Open': 'Open',
      'In Discussion': 'InDiscussion',
      'Assigned': 'Assigned',
      'Completed': 'Completed',
      'Flagged': 'Flagged',
    };
    projectsApi.update(projectId, { status: statusMap[status] || status }).catch(() => {});
    addToast('Project status updated', `Marked as ${status}`, 'info');
  }, [addToast]);

  const updateProposalStatus = useCallback((proposalId: string, status: Proposal['status']) => {
    setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, status } : p)));
    proposalsApi.updateStatus(proposalId, status).catch(() => {});
    addToast('Proposal updated', `Status: ${status}`, 'info');
  }, [addToast]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    projectsApi.delete(projectId).catch(() => {});
    addToast('Project removed', 'Listing has been archived by administrator', 'warning');
  }, [addToast]);

  const updateUserStatus = useCallback((userId: string, status: User['status']) => {
    if (status) {
      adminApi.updateUserStatus(userId, status).catch(() => {});
    }
    addToast('User account updated', `Status changed to ${status}`, 'info');
  }, [addToast]);

  const verifyFreelancer = useCallback((freelancerId: string, verified: boolean) => {
    setFreelancers((prev) =>
      prev.map((f) => (f.id === freelancerId ? { ...f, verifiedLocal: verified } : f))
    );
    addToast('Verification badge toggled', verified ? 'Freelancer verified' : 'Verification removed', 'info');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentFreelancerProfile,
        users,
        freelancers,
        projects,
        proposals,
        inquiries,
        savedFreelancerIds,
        savedProjectIds,
        toasts,
        isLoadingAuth,
        addToast,
        removeToast,
        login,
        logout,
        postProject,
        submitProposal,
        sendInquiry,
        replyToInquiry,
        toggleSaveFreelancer,
        toggleSaveProject,
        updateFreelancerProfile,
        updateClientProfile,
        addFreelancerService,
        updateFreelancerService,
        deleteFreelancerService,
        addFreelancerPortfolioItem,
        updateFreelancerPortfolioItem,
        deleteFreelancerPortfolioItem,
        updateProjectStatus,
        updateProposalStatus,
        deleteProject,
        updateUserStatus,
        verifyFreelancer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
