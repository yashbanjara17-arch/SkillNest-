import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Freelancer } from '../../types';
import { useApp } from '../../context/AppContext';
import { InquiryModal } from '../modals/InquiryModal';
import { Star, MapPin, Bookmark, Check, Users, Sparkles, ArrowRight } from 'lucide-react';

interface FreelancerCardProps {
  freelancer: Freelancer;
  matchExplanation?: string;
  matchScore?: number;
}

export const FreelancerCard: React.FC<FreelancerCardProps> = ({
  freelancer,
  matchExplanation,
  matchScore
}) => {
  const { savedFreelancerIds, toggleSaveFreelancer } = useApp();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const isSaved = savedFreelancerIds.includes(freelancer.id);

  return (
    <>
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs hover:shadow-sm p-5 flex flex-col justify-between">
        <div>
          {/* Match kicker if matching is present */}
          {matchScore && matchScore > 50 && (
            <div className="mb-3 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{matchExplanation || `${matchScore}% Match for your criteria`}</span>
              </div>
              <span className="font-bold tabular-nums">{matchScore}%</span>
            </div>
          )}

          {/* Profile Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Link to={`/freelancer/${freelancer.id}`} className="shrink-0 relative group">
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="w-13 h-13 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 group-hover:opacity-90 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                {freelancer.isTeam && (
                  <span className="absolute -bottom-1 -right-1 bg-neutral-900 dark:bg-neutral-800 text-white p-0.5 rounded-md text-[10px] border border-neutral-700" title="Agency / Team">
                    <Users className="w-3 h-3" />
                  </span>
                )}
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link 
                    to={`/freelancer/${freelancer.id}`} 
                    className="font-bold text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-base"
                  >
                    {freelancer.name}
                  </Link>
                  {freelancer.isTeam && (
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      ({freelancer.teamSize} Member Team)
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-0.5 font-medium">
                  {freelancer.headline}
                </p>
                {/* Clean unboxed location and rating metadata */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{freelancer.location}</span>
                  </span>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold tabular-nums">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{freelancer.rating.toFixed(1)}</span>
                    <span className="text-neutral-400 dark:text-neutral-500 font-normal">({freelancer.reviewCount})</span>
                  </span>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                  <span className="text-neutral-600 dark:text-neutral-400">{freelancer.experienceYears} yrs exp</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSaveFreelancer(freelancer.id)}
              className={`p-2 rounded-lg border transition-colors shrink-0 ${
                isSaved
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save freelancer'}
              aria-label="Bookmark freelancer"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
            </button>
          </div>

          {/* Bio snippet */}
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
            {freelancer.bio}
          </p>

          {/* Clean skills list */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {freelancer.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {freelancer.skills.length > 5 && (
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 self-center">
                +{freelancer.skills.length - 5} more
              </span>
            )}
          </div>

          {/* Portfolio Thumbnail Preview if available */}
          {freelancer.portfolio && freelancer.portfolio.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
                Recent Local Work
              </span>
              <div className="grid grid-cols-2 gap-2">
                {freelancer.portfolio.slice(0, 2).map((item) => (
                  <div key={item.id} className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 group/port h-20 bg-neutral-100 dark:bg-neutral-800">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover/port:scale-105 transition-transform duration-300" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent flex items-end p-1.5">
                      <p className="text-[10px] text-white font-medium truncate">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">Starting from</span>
            <p className="text-sm font-bold text-neutral-900 dark:text-white tabular-nums">
              ₹{freelancer.startingProjectRateInr.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400 ml-1">/ project</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/freelancer/${freelancer.id}`}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              View Profile
            </Link>
            <button
              onClick={() => setInquiryOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-xs"
            >
              Enquire
            </button>
          </div>
        </div>
      </div>

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        freelancer={freelancer}
      />
    </>
  );
};
