import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { Bookmark, Search } from 'lucide-react';

export const FreelancerSavedPage: React.FC = () => {
  const { projects, savedProjectIds } = useApp();

  const savedProjects = projects.filter(p => savedProjectIds.includes(p.id));

  return (
    <WorkspaceShell
      title="Saved Projects"
      subtitle="Client requirements you have bookmarked for review and proposal submission"
      action={
        <Link
          to="/projects"
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Browse All Projects</span>
        </Link>
      }
    >
      {savedProjects.length > 0 ? (
        <div className="space-y-4">
          <p className="text-xs text-neutral-400">
            You have <strong className="text-white">{savedProjects.length}</strong> saved project opportunities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No saved projects yet"
          description="Browse active client postings in Boisar, Palghar, and Tarapur MIDC to save projects of interest."
          actionLabel="Find Projects"
          onAction={() => {}}
        />
      )}
    </WorkspaceShell>
  );
};
