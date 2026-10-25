import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Freelancer, Project, Proposal, DirectInquiry, User, UserRole, ToastMessage } from '../types';
import { INITIAL_USERS, INITIAL_FREELANCERS, INITIAL_PROJECTS } from '../data/mockData';
import { authApi, projectsApi, proposalsApi, inquiriesApi, savedApi, adminApi } from '../lib/api';

interface AppContextType {
  currentUser: User | null;
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
  // login now accepts userId from API response
  login: (email: string, role: UserRole, name?: string, userId?: string) => void;
  logout: () => void;
  postProject: (newProject: Omit<Project, 'id' | 'postedDate' | 'status' | 'proposalsCount' | 'clientId' | 'clientName'>) => string;
  submitProposal: (projectId: string, priceInr: number, timeline: string, message: string) => void;
  sendInquiry: (freelancerId: string, projectTitle: string, message: string, budgetInr?: number, meetingPref?: 'In-person (Local)' | 'Phone Call' | 'Video Meeting') => void;
  replyToInquiry: (inquiryId: string, message: string) => void;
  toggleSaveFreelancer: (freelancerId: string) => void;
  toggleSaveProject: (projectId: string) => void;
  updateFreelancerProfile: (freelancerId: string, updates: Partial<Freelancer>) => void;
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
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Public/display data still uses mock data for now (freelancers and projects
  // will be progressively replaced by API calls in individual page components)
  const [freelancers, setFreelancers] = useState<Freelancer[]>(INITIAL_FREELANCERS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [inquiries, setInquiries] = useState<DirectInquiry[]>([]);
  const [savedFreelancerIds, setSavedFreelancerIds] = useState<string[]>([]);
  const [savedProjectIds, setSavedProjectIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ── Session Restoration & Data Sync ─────────────────────────────────────
  useEffect(() => {
    authApi.me()
      .then((res) => {
        if (res.success && res.data) {
          const u = res.data as Record<string, unknown>;
          setCurrentUser({
            id: u.id as string,
            name: u.name as string,
            email: u.email as string,
            role: u.role as UserRole,
            avatar: (u.avatarUrl as string) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            location: (u.location as string) || 'Boisar, Maharashtra',
            bio: u.bio as string | undefined,
            organization: undefined,
            status: (u.status as User['status']) || 'Active',
          });

          // Fetch saved IDs from backend for authenticated user
          savedApi.getIds().then((savedRes) => {
            if (savedRes.success && savedRes.data) {
              setSavedFreelancerIds(savedRes.data.savedFreelancerIds || []);
              setSavedProjectIds(savedRes.data.savedProjectIds || []);
            }
          }).catch(() => {});
        }
      })
      .catch(() => { /* Not authenticated */ })
      .finally(() => setIsLoadingAuth(false));
  }, []);

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
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
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
    }
  }, [users]);

  const logout = useCallback(async () => {
    const name = currentUser?.name;
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    setCurrentUser(null);
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
    const fl = freelancers.find((f) => f.name === currentUser?.name) || freelancers[0];
    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      projectId,
      freelancerId: fl.id,
      freelancerName: currentUser?.name || fl.name,
      freelancerAvatar: currentUser?.avatar || fl.avatar,
      freelancerHeadline: fl.headline,
      freelancerLocation: fl.location,
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
  }, [currentUser, freelancers, addToast]);

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
    inquiriesApi.sendMessage(inquiryId, message).catch((err) => {
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

  const updateFreelancerProfile = useCallback((freelancerId: string, updates: Partial<Freelancer>) => {
    setFreelancers((prev) => prev.map((f) => (f.id === freelancerId ? { ...f, ...updates } : f)));
    addToast('Profile updated', 'Changes have been published to your public card', 'success');
  }, [addToast]);

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
