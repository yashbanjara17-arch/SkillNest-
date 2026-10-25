import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProposalModal } from '../components/modals/ProposalModal';
import { calculateFreelancerMatch } from '../utils/matching';
import { 
  MapPin, 
  Clock, 
  IndianRupee, 
  Briefcase, 
  CheckCircle2, 
  ChevronLeft, 
  Bookmark, 
  Building2, 
  Sparkles,
  Users,
  Send
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, freelancers, proposals, currentUser, savedProjectIds, toggleSaveProject } = useApp();

  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Project Not Found</h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">The project listing might have been completed or removed.</p>
        <Link to="/projects" className="inline-block px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm">
          Browse All Projects
        </Link>
      </div>
    );
  }

  const isSaved = savedProjectIds.includes(project.id);
  const userHasApplied = proposals.some(
    p => p.projectId === project.id && (p.freelancerName === currentUser?.name || p.freelancerId === currentUser?.id)
  );

  // Calculate top matching freelancers for this project
  const matchedFreelancers = freelancers
    .map(fl => ({
      freelancer: fl,
      match: calculateFreelancerMatch(fl, project)
    }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  // Proposals received for this project
  const projectProposals = proposals.filter(p => p.projectId === project.id);
  const isOwner = currentUser?.id === project.clientId || currentUser?.name === project.clientName;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <Link to="/projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>All Projects</span>
        </Link>
        <span>/</span>
        <span className="text-neutral-800 dark:text-neutral-200 font-semibold truncate max-w-sm">{project.title}</span>
      </div>

      {/* Main Project Header Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs p-6 sm:p-8 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/60">
                {project.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>Posted on {project.postedDate}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{project.status}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-snug">
              {project.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 flex-wrap pt-1">
              <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>{project.clientOrganization || project.clientName}</span>
              </span>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Client in {project.clientLocation}</span>
              </span>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>Timeline: {project.timeline}</span>
              </span>
            </div>
          </div>

          {/* Budget & Action Box */}
          <div className="bg-neutral-50 dark:bg-neutral-800/60 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3 shrink-0 lg:w-72">
            <div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Client Budget Range</span>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
                ₹{project.budgetMinInr.toLocaleString('en-IN')} – ₹{project.budgetMaxInr.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                {project.isBudgetNegotiable ? 'Negotiable directly with client' : 'Fixed budget'}
              </p>
            </div>

            <div className="space-y-2">
              {userHasApplied ? (
                <div className="w-full py-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Proposal Submitted</span>
                </div>
              ) : (
                <button
                  onClick={() => setProposalModalOpen(true)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-center"
                >
                  Submit Proposal
                </button>
              )}

              <button
                onClick={() => toggleSaveProject(project.id)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                  isSaved
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-700 dark:fill-indigo-300' : ''}`} />
                <span>{isSaved ? 'Saved to Bookmarks' : 'Save Project'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Description & Details (Left) + Recommended Freelancers (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Project Scope */}
          <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-6 space-y-4 transition-colors">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Project Scope & Description</h3>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </section>

          {/* Required Skills */}
          <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-6 space-y-3 transition-colors">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Required Skills & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Client Expectations & Logistics */}
          <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-6 space-y-4 text-xs text-neutral-600 dark:text-neutral-400 transition-colors">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Collaboration Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80">
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase">Preferred Region</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{project.preferredArea}</p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Client prefers professionals who can meet locally if needed.</p>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80">
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase">Preferred Provider</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{project.preferredWorkerType}</p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Open to both individuals and small agencies.</p>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80">
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase">Communication Preference</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{project.contactPreference}</p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Direct contact after proposal review.</p>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80">
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase">Proposals Status</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{project.proposalsCount} Proposals Submitted</p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">Direct negotiation with no bidding race.</p>
              </div>
            </div>
          </section>

          {/* Proposals List (if owner or submitted) */}
          {projectProposals.length > 0 && (
            <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-6 space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Received Proposals ({projectProposals.length})
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Only visible in review mode</span>
              </div>

              <div className="space-y-3">
                {projectProposals.map((prop) => (
                  <div key={prop.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={prop.freelancerAvatar} alt={prop.freelancerName} className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-700" />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">{prop.freelancerName}</p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{prop.freelancerHeadline} · {prop.freelancerLocation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-neutral-900 dark:text-white text-sm tabular-nums">
                          ₹{prop.proposedPriceInr.toLocaleString('en-IN')}
                        </span>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{prop.estimatedTimeline}</p>
                      </div>
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed italic bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
                      "{prop.coverMessage}"
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right 4 Columns: Top Recommended Nearby Freelancers */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4 transition-colors">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Matching Local Freelancers
              </h4>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Professionals near {project.clientLocation} with matching skills:
            </p>

            <div className="space-y-3">
              {matchedFreelancers.map(({ freelancer, match }) => (
                <div key={freelancer.id} className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 space-y-2 text-xs">
                  <div className="flex items-start gap-2.5">
                    <img src={freelancer.avatar} alt={freelancer.name} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-neutral-200 dark:border-neutral-700" />
                    <div>
                      <Link to={`/freelancer/${freelancer.id}`} className="font-bold text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {freelancer.name}
                      </Link>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">{freelancer.headline}</p>
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium mt-0.5">
                        {match.score}% Match · {match.explanation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-200/50 dark:border-neutral-700/50 text-[11px]">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">₹{freelancer.startingProjectRateInr.toLocaleString('en-IN')} start</span>
                    <Link to={`/freelancer/${freelancer.id}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProposalModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        project={project}
      />
    </div>
  );
};
