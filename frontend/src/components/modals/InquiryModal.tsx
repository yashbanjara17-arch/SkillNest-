import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Freelancer } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, MessageSquare, MapPin, IndianRupee, Phone } from 'lucide-react';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancer: Freelancer;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  freelancer
}) => {
  const { sendInquiry, currentUser } = useApp();

  const [projectTitle, setProjectTitle] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [meetingPref, setMeetingPref] = useState<'In-person (Local)' | 'Phone Call' | 'Video Meeting'>('In-person (Local)');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !message.trim()) {
      setError('Please provide a project subject and details of your requirement.');
      return;
    }

    sendInquiry(
      freelancer.id,
      projectTitle,
      message,
      budget ? parseInt(budget, 10) : undefined,
      meetingPref
    );

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setProjectTitle('');
    setMessage('');
    setBudget('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={`Direct Enquiry to ${freelancer.name}`}
    >
      {isSubmitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white">Enquiry Dispatched!</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-md mx-auto">
              Your inquiry has been delivered directly to <span className="font-semibold text-neutral-900 dark:text-white">{freelancer.name}</span>. Since SkillNest does not take a cut on your negotiated project fees, you can agree on terms directly.
            </p>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-3 text-xs text-neutral-600 dark:text-neutral-300 text-left border border-neutral-200 dark:border-neutral-700">
            <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Next Steps:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-neutral-600 dark:text-neutral-400">
              <li>{freelancer.name} usually responds via {freelancer.contactPreference}.</li>
              <li>You can view this enquiry in your <span className="font-medium text-neutral-900 dark:text-white">Client Dashboard</span>.</li>
              <li>Feel free to schedule a local meet-up in {freelancer.areaName} if preferred.</li>
            </ul>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-full py-2.5 px-4 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300">
            <img 
              src={freelancer.avatar} 
              alt={freelancer.name} 
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200 dark:border-neutral-700" 
            />
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">{freelancer.name}</p>
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                <MapPin className="w-3 h-3 text-indigo-500" />
                <span>{freelancer.location}</span>
                <span>·</span>
                <span>Starting from ₹{freelancer.startingProjectRateInr.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Project Title / Service Needed <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Website development for Palghar diagnostic center"
              className="w-full text-xs px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Project Details & Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you need built, existing assets, timeline expectations, or questions..."
              className="w-full text-xs px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Estimated Budget (INR, Negotiable)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-neutral-400 text-xs">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 25000"
                  className="w-full text-xs pl-7 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Preferred Discussion Mode
              </label>
              <select
                value={meetingPref}
                onChange={(e) => setMeetingPref(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
              >
                <option value="In-person (Local)" className="dark:bg-neutral-900">In-person (Meet locally in {freelancer.areaName})</option>
                <option value="Phone Call" className="dark:bg-neutral-900">Phone / WhatsApp Call</option>
                <option value="Video Meeting" className="dark:bg-neutral-900">Video Call (Google Meet)</option>
              </select>
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 pt-1">
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Sending as:</span>
            <span>{currentUser?.name || 'Guest Business Owner'}</span>
            <span>({currentUser?.email || 'unregistered'})</span>
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
              Send Direct Enquiry
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
