import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { FreelancerCard } from '../../components/freelancers/FreelancerCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Bookmark, Search } from 'lucide-react';

export const ClientSavedPage: React.FC = () => {
  const { freelancers, savedFreelancerIds } = useApp();

  const savedList = freelancers.filter(f => savedFreelancerIds.includes(f.id));

  return (
    <WorkspaceShell
      title="Saved Freelancers & Teams"
      subtitle="Your curated shortlist of local talent for upcoming projects"
      action={
        <Link
          to="/freelancers"
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Browse More Talent</span>
        </Link>
      }
    >
      {savedList.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-neutral-400">
            You have <strong className="text-white">{savedList.length}</strong> specialists saved to your local shortlist:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedList.map((fl) => (
              <FreelancerCard key={fl.id} freelancer={fl} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved freelancers yet"
          description="Browse the directory to bookmark talented developers, designers, and video producers in Boisar and Palghar."
          actionLabel="Find Freelancers"
          onAction={() => {}}
        />
      )}
    </WorkspaceShell>
  );
};
