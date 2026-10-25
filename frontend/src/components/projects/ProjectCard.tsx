import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';
import { ProposalModal } from '../modals/ProposalModal';
import { MapPin, IndianRupee, Clock, Bookmark, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { savedProjectIds, toggleSaveProject, proposals, currentUser } = useApp();
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  const isSaved = savedProjectIds.includes(project.id);
  const userHasApplied = proposals.some(
    p => p.projectId === project.id && (p.freelancerName === currentUser?.name || p.freelancerId === currentUser?.id)
  );

  return (
    <>
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs hover:shadow-sm p-5 flex flex-col justify-between">
        <div>
          {/* Header & Bookmark */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                <span>{project.category}</span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span>Posted {project.postedDate}</span>
                {project.status === 'Open' ? (
                  <>
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium">Accepting Proposals</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">{project.status}</span>
                  </>
                )}
              </div>
              <Link 
                to={`/project/${project.id}`}
                className="font-bold text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-base leading-snug line-clamp-2 transition-colors"
              >
                {project.title}
              </Link>
            </div>

            <button
              onClick={() => toggleSaveProject(project.id)}
              className={`p-2 rounded-lg border transition-colors shrink-0 ${
                isSaved
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save project'}
              aria-label="Bookmark project"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
            </button>
          </div>

          {/* Client & Location metadata */}
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 mt-2 flex-wrap">
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {project.clientOrganization || project.clientName}
            </span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{project.clientLocation}</span>
            </span>
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 shrink-0" />
              <span>{project.timeline}</span>
            </span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-3 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {/* Skills Required */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {project.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Client Budget (Negotiable)</span>
            <p className="text-sm font-bold text-neutral-900 dark:text-white tabular-nums">
              ₹{project.budgetMinInr.toLocaleString('en-IN')} – ₹{project.budgetMaxInr.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/project/${project.id}`}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              Details
            </Link>

            {userHasApplied ? (
              <span className="px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Applied</span>
              </span>
            ) : (
              <button
                onClick={() => setProposalModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-xs"
              >
                Apply
              </button>
            )}
          </div>
        </div>
      </div>

      <ProposalModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        project={project}
      />
    </>
  );
};
