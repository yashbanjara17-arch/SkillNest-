import React from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { Star, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const { freelancers } = useApp();

  // Aggregate all reviews across freelancers
  const allReviews = freelancers.flatMap((fl) => 
    fl.reviews.map((r) => ({ ...r, freelancerName: fl.name, freelancerId: fl.id }))
  );

  return (
    <WorkspaceShell
      title="Verified Client Reviews & Trust Audits"
      subtitle="Inspect client ratings and testimonials delivered for local Maharashtra businesses"
    >
      <div className="space-y-4">
        <p className="text-xs text-neutral-400">
          Showing <span className="text-white font-bold">{allReviews.length}</span> authentic local feedback entries submitted by regional business clients:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allReviews.map((rev) => (
            <GlassCard key={rev.id} className="p-5 bg-white/5 border-white/10 space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{rev.clientName}</h4>
                  <p className="text-[11px] text-neutral-400">{rev.clientCompany || rev.clientLocation}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-neutral-300 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-white/10">
                <span>Deliverable: <strong className="text-neutral-200">{rev.projectTitle}</strong></span>
                <span className="text-indigo-400 font-medium">For: {rev.freelancerName}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
};
