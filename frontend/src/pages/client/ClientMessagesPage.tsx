import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { MessageSquare, Send, MapPin, Phone, IndianRupee, Clock, User, CheckCircle2 } from 'lucide-react';

export const ClientMessagesPage: React.FC = () => {
  const { inquiries, freelancers, currentUser, replyToInquiry } = useApp();

  const myInquiries = inquiries.filter(
    (inq) => inq.clientId === currentUser?.id || inq.clientName === currentUser?.name
  );

  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(
    myInquiries[0]?.id || inquiries[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  const activeInquiry = inquiries.find(i => i.id === selectedInquiryId) || inquiries[0];
  const targetFreelancer = activeInquiry ? freelancers.find(f => f.id === activeInquiry.freelancerId) : null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeInquiry) return;
    replyToInquiry(activeInquiry.id, replyText.trim());
    setReplyText('');
  };

  return (
    <WorkspaceShell
      title="Messages & Contact Requests"
      subtitle="Direct 1-on-1 communication with local professionals in Boisar, Palghar & Tarapur"
    >
      {inquiries.length === 0 ? (
        <GlassCard className="p-12 text-center max-w-md mx-auto space-y-3">
          <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto" />
          <h4 className="text-base font-bold text-neutral-900 dark:text-white">No active conversations yet</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Browse verified freelancers in Boisar or Palghar and click "Enquire" to start a direct discussion.
          </p>
          <Link
            to="/freelancers"
            className="inline-block px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 mt-2"
          >
            Find Nearby Freelancers
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* Left Column: Conversation List */}
          <div className="lg:col-span-5 space-y-2">
            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Active Threads ({myInquiries.length > 0 ? myInquiries.length : inquiries.length})
            </p>

            <div className="space-y-2">
              {(myInquiries.length > 0 ? myInquiries : inquiries).map((inq) => {
                const fl = freelancers.find(f => f.id === inq.freelancerId);
                const isSelected = inq.id === activeInquiry?.id;

                return (
                  <button
                    key={inq.id}
                    onClick={() => setSelectedInquiryId(inq.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-400 dark:border-indigo-500/60 shadow-sm'
                        : 'bg-white dark:bg-white/5 border-neutral-200/80 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={fl?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                          alt={fl?.name || 'Freelancer'}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-neutral-700"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white text-xs">{fl?.name || inq.clientName}</p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[170px]">{inq.projectTitle}</p>
                        </div>
                      </div>

                      <span className="text-[10px] text-neutral-400 font-medium shrink-0">
                        {inq.createdAt}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Conversation View */}
          {activeInquiry && (
            <div className="lg:col-span-7 bg-white dark:bg-white/5 border border-neutral-200/90 dark:border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
              {/* Header */}
              <div className="pb-4 border-b border-neutral-200 dark:border-white/10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={targetFreelancer?.avatar}
                    alt={targetFreelancer?.name}
                    className="w-11 h-11 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-sm">{targetFreelancer?.name}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{targetFreelancer?.headline}</p>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">{targetFreelancer?.location}</span>
                      <span>·</span>
                      <span>Meeting: <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{activeInquiry.meetingPreference}</strong></span>
                    </div>
                  </div>
                </div>

                {targetFreelancer && (
                  <Link
                    to={`/freelancer/${targetFreelancer.id}`}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline shrink-0"
                  >
                    View Portfolio
                  </Link>
                )}
              </div>

              {/* Message Thread */}
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 text-xs">
                {/* Initial Inquiry Bubble */}
                <div className="bg-neutral-50 dark:bg-white/5 p-4 rounded-2xl border border-neutral-200/80 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-300">Project: {activeInquiry.projectTitle}</span>
                    <span>{activeInquiry.createdAt}</span>
                  </div>
                  <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    {activeInquiry.initialMessage}
                  </p>
                  {activeInquiry.proposedBudgetInr && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                      Estimated Proposed Budget: ₹{activeInquiry.proposedBudgetInr.toLocaleString('en-IN')} (Negotiable)
                    </p>
                  )}
                </div>

                {/* Follow-up Replies */}
                {activeInquiry.replies?.map((rep, idx) => (
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

              {/* Direct Negotiation Reminder */}
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-3 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Direct Pricing: Agree on project price and milestone terms directly without 20% platform deductions.</span>
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a response or suggest a local meeting time..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-neutral-900 dark:text-white placeholder:text-neutral-400 text-xs outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </WorkspaceShell>
  );
};
