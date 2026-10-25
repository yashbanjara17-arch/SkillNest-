import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Freelancer } from '../../types';
import { useApp } from '../../context/AppContext';
import { InquiryModal } from '../modals/InquiryModal';
import { Star, MapPin, Bookmark, Users, Sparkles, Briefcase, ExternalLink, ShieldCheck } from 'lucide-react';

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
  const { currentUser, savedFreelancerIds, toggleSaveFreelancer } = useApp();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const isSaved = savedFreelancerIds.includes(freelancer.id);
  const isOwner = Boolean(
    currentUser &&
    (currentUser.id === freelancer.userId ||
     currentUser.id === freelancer.id ||
     (freelancer.name && currentUser.name === freelancer.name))
  );

  const isIncomplete =
    !freelancer.headline?.trim() ||
    !freelancer.bio?.trim() ||
    freelancer.skills.length === 0;

  // Initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'FL';
  };

  return (
    <>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all shadow-xs hover:shadow-md p-5 sm:p-6 flex flex-col justify-between h-full min-h-[410px] group">
        <div>
          {/* Owner-only reminder */}
          {isOwner && isIncomplete && (
            <div className="mb-3.5 flex items-center justify-between text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
              <span className="font-semibold">Your public card is incomplete</span>
              <Link to="/freelancer/profile" className="font-bold underline hover:text-amber-900 dark:hover:text-amber-200">
                Complete now →
              </Link>
            </div>
          )}

          {/* Match score banner if present */}
          {matchScore && matchScore > 50 && (
            <div className="mb-3.5 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/50 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="truncate">{matchExplanation || `${matchScore}% Match for your criteria`}</span>
              </div>
              <span className="font-bold tabular-nums ml-2 shrink-0">{matchScore}%</span>
            </div>
          )}

          {/* Header: Avatar, Name, Type, Location */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <Link to={`/freelancer/${freelancer.id}`} className="shrink-0 relative group/avatar">
                {avatarError || !freelancer.avatar ? (
                  <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs border border-indigo-200 dark:border-indigo-900">
                    {getInitials(freelancer.name)}
                  </div>
                ) : (
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    onError={() => setAvatarError(true)}
                    className="w-13 h-13 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 group-hover/avatar:opacity-95 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                )}
                {freelancer.isTeam && (
                  <span
                    className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-md text-[10px] border border-white dark:border-neutral-900 shadow-xs"
                    title={`Agency Studio (${freelancer.teamSize || 2} Members)`}
                  >
                    <Users className="w-3 h-3" />
                  </span>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Link
                    to={`/freelancer/${freelancer.id}`}
                    className="font-bold text-neutral-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-base truncate"
                  >
                    {freelancer.name}
                  </Link>

                  {freelancer.isTeam ? (
                    <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200/80 dark:border-indigo-900/50">
                      {freelancer.teamSize ? `${freelancer.teamSize}p Team` : 'Studio Team'}
                    </span>
                  ) : freelancer.verifiedLocal ? (
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Verified</span>
                    </span>
                  ) : null}
                </div>

                {/* Professional Headline */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-1 mt-0.5 font-medium">
                  {freelancer.headline?.trim() || `${freelancer.category} Specialist`}
                </p>

                {/* Location, Rating, Experience metadata */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="truncate">{freelancer.location || 'Boisar, Palghar Dist.'}</span>
                  </span>

                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>

                  {freelancer.reviewCount > 0 ? (
                    <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold tabular-nums">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{freelancer.rating.toFixed(1)}</span>
                      <span className="text-neutral-400 dark:text-neutral-500 font-normal">({freelancer.reviewCount})</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.2 rounded">
                      New Pro
                    </span>
                  )}

                  {freelancer.experienceYears > 0 && (
                    <>
                      <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                      <span className="text-neutral-600 dark:text-neutral-400">{freelancer.experienceYears}y exp</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleSaveFreelancer(freelancer.id)}
              className={`p-2 rounded-xl border transition-colors shrink-0 ${
                isSaved
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save freelancer'}
              aria-label="Bookmark freelancer"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`} />
            </button>
          </div>

          {/* Bio snippet or intentional "in progress" state */}
          <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
            {freelancer.bio?.trim()
              ? freelancer.bio
              : 'Profile in setup · Verified local talent ready for direct inquiries and custom project discussions.'}
          </p>

          {/* Skills pills */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {freelancer.skills.length > 0 ? (
              <>
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
              </>
            ) : (
              <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 px-2 py-0.5 rounded-md italic">
                Skills updating
              </span>
            )}
          </div>

          {/* Featured Portfolio preview with graceful image fallback */}
          {freelancer.portfolio && freelancer.portfolio.length > 0 && (
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
                Recent Local Work
              </span>
              <div className="grid grid-cols-2 gap-2">
                {freelancer.portfolio.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700/80 group/port h-20 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-center"
                  >
                    {failedImages[item.id] || !item.imageUrl ? (
                      <div className="p-2 w-full h-full flex flex-col items-center justify-center bg-indigo-50/60 dark:bg-indigo-950/40">
                        <Briefcase className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mb-1" />
                        <span className="text-[10px] font-semibold text-neutral-800 dark:text-neutral-200 truncate w-full px-1">
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      <>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          onError={() => setFailedImages((prev) => ({ ...prev, [item.id]: true }))}
                          className="w-full h-full object-cover group-hover/port:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end p-1.5">
                          <p className="text-[10px] text-white font-medium truncate">{item.title}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 block uppercase tracking-wider">
              {freelancer.startingProjectRateInr > 0 ? 'Starting from' : 'Pricing'}
            </span>
            {freelancer.startingProjectRateInr > 0 ? (
              <p className="text-sm font-bold text-neutral-900 dark:text-white tabular-nums">
                ₹{freelancer.startingProjectRateInr.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400 ml-1">/ project</span>
              </p>
            ) : (
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Custom on enquiry
              </p>
            )}
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
