import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Project } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, IndianRupee, Clock, Briefcase } from 'lucide-react';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const { submitProposal, currentUser, proposals } = useApp();

  const [proposedPrice, setProposedPrice] = useState<string>(
    project.budgetMinInr ? project.budgetMinInr.toString() : ''
  );
  const [timeline, setTimeline] = useState<string>(project.timeline || '2 weeks');
  const [coverMessage, setCoverMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Check if current user already submitted
  const alreadySubmitted = proposals.some(
    p => p.projectId === project.id && (p.freelancerName === currentUser?.name || p.freelancerId === currentUser?.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedPrice || isNaN(Number(proposedPrice))) {
      setError('Please provide a valid proposed project quote in INR.');
      return;
    }
    if (!coverMessage.trim() || coverMessage.trim().length < 20) {
      setError('Please provide a substantive proposal message explaining how you will execute this project (at least 20 characters).');
      return;
    }

    submitProposal(
      project.id,
      parseInt(proposedPrice, 10),
      timeline,
      coverMessage
    );

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={`Submit Proposal for "${project.title}"`}
    >
      {alreadySubmitted && !isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-neutral-900 dark:text-white">Proposal Already Submitted</h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              You have already sent your expression of interest for this project. Check your Freelancer Hub to track client responses.
            </p>
          </div>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-neutral-900 dark:bg-neutral-800 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      ) : isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white">Proposal Submitted Successfully!</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-md mx-auto">
              Your proposal has been shared with <span className="font-semibold text-neutral-900 dark:text-white">{project.clientName}</span>. They will review your profile, portfolio samples, and contact you directly.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-full py-2.5 px-4 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            View My Applications
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">{project.title}</p>
                <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">Posted by {project.clientName} · {project.clientLocation}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Client Budget:</span>
                <p className="font-semibold text-neutral-900 dark:text-white">₹{project.budgetMinInr.toLocaleString('en-IN')} - ₹{project.budgetMaxInr.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Your Quoted Fee (INR) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-neutral-400 text-xs">₹</span>
                <input
                  type="number"
                  required
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder="e.g. 24000"
                  className="w-full text-xs pl-7 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Direct client fee. SkillNest takes 0% commission.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Estimated Delivery Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g. 10 days, 3 weeks"
                className="w-full text-xs px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Cover Pitch & Solution Approach <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              placeholder="Explain your approach, why your local availability is an advantage, relevant past projects in Boisar/Palghar, and how you plan to communicate..."
              className="w-full text-xs px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
