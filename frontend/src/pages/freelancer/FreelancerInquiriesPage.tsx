import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { MessageSquare, Send, MapPin, Mail, Phone, Calendar } from 'lucide-react';

export const FreelancerInquiriesPage: React.FC = () => {
  const { inquiries, currentUser, freelancers, replyToInquiry } = useApp();

  const myProfile = freelancers.find(
    f => f.name === currentUser?.name || f.id === currentUser?.id
  ) || freelancers[0];

  const receivedInquiries = inquiries.filter(
    inq => inq.freelancerId === myProfile.id
  );

  const [activeInquiryId, setActiveInquiryId] = useState<string>(
    receivedInquiries[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  const currentInquiry = receivedInquiries.find(i => i.id === activeInquiryId) || receivedInquiries[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentInquiry) return;
    replyToInquiry(currentInquiry.id, replyText.trim());
    setReplyText('');
  };

  return (
    <WorkspaceShell
      title="Client Inquiries & Direct Requests"
      subtitle="Direct enquiries from businesses wanting to hire your services"
    >
      {receivedInquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No direct inquiries yet"
          description="Keep your portfolio and skills updated. As local businesses browse the directory, inquiries will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* Thread List */}
          <div className="lg:col-span-5 space-y-2">
            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Inquiries ({receivedInquiries.length})
            </p>
            {receivedInquiries.map((inq) => {
              const isSelected = inq.id === currentInquiry?.id;
              return (
                <button
                  key={inq.id}
                  onClick={() => setActiveInquiryId(inq.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-400 dark:border-indigo-500/60 shadow-sm'
                      : 'bg-white dark:bg-white/5 border-neutral-200/80 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white text-xs">{inq.clientName}</p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[200px] mt-0.5">{inq.projectTitle}</p>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">Preference: {inq.meetingPreference}</p>
                    </div>
                    <span className="text-[10px] text-neutral-400">{inq.createdAt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conversation Detail */}
          {currentInquiry && (
            <div className="lg:col-span-7 bg-white dark:bg-white/5 border border-neutral-200/90 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="pb-4 border-b border-neutral-200 dark:border-white/10 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white text-base">{currentInquiry.clientName}</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">{currentInquiry.projectTitle}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Contact: {currentInquiry.clientEmail} {currentInquiry.clientPhone ? `· ${currentInquiry.clientPhone}` : ''}
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  {currentInquiry.status}
                </span>
              </div>

              {/* Message History */}
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 text-xs">
                <div className="bg-neutral-50 dark:bg-white/5 p-4 rounded-2xl border border-neutral-200/80 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-300">Initial Client Request</span>
                    <span>{currentInquiry.createdAt}</span>
                  </div>
                  <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
                    "{currentInquiry.initialMessage}"
                  </p>
                  {currentInquiry.proposedBudgetInr && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                      Client Indicative Budget: ₹{currentInquiry.proposedBudgetInr.toLocaleString('en-IN')} (Negotiable directly)
                    </p>
                  )}
                </div>

                {currentInquiry.replies?.map((rep, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-1 ${
                      rep.senderName === currentUser?.name
                        ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-200 dark:border-indigo-500/30 ml-8 text-neutral-900 dark:text-neutral-100'
                        : 'bg-neutral-100 dark:bg-white/10 border-neutral-200 dark:border-white/10 mr-8 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400">
                      <span className="font-bold text-neutral-900 dark:text-white">{rep.senderName}</span>
                      <span>{rep.sentAt}</span>
                    </div>
                    <p className="leading-relaxed">{rep.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply with your availability or suggested discussion time..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </WorkspaceShell>
  );
};
