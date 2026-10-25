import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { InquiryModal } from '../components/modals/InquiryModal';
import { Modal } from '../components/common/Modal';
import { PortfolioItem } from '../types';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Users, 
  Calendar, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  ExternalLink,
  ChevronLeft,
  MessageSquare,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const FreelancerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { freelancers, savedFreelancerIds, toggleSaveFreelancer } = useApp();

  const freelancer = freelancers.find(f => f.id === id);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activePortfolioModal, setActivePortfolioModal] = useState<PortfolioItem | null>(null);

  if (!freelancer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Freelancer Profile Not Found</h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">The requested profile might have been updated or removed.</p>
        <Link to="/freelancers" className="inline-block px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm">
          Back to Freelancers
        </Link>
      </div>
    );
  }

  const isSaved = savedFreelancerIds.includes(freelancer.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <Link to="/freelancers" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>All Freelancers</span>
        </Link>
        <span>/</span>
        <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{freelancer.name}</span>
      </div>

      {/* Profile Marquee Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs p-6 sm:p-8 transition-colors">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="relative shrink-0">
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-neutral-200 dark:border-neutral-700 shadow-xs"
                referrerPolicy="no-referrer"
              />
              {freelancer.isTeam && (
                <span className="absolute -bottom-2 -right-2 bg-neutral-900 dark:bg-neutral-800 text-white px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1 shadow-sm border border-neutral-700" title="Agency Team">
                  <Users className="w-3 h-3" />
                  <span>{freelancer.teamSize} Team</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {freelancer.name}
                </h1>
                {freelancer.verifiedLocal && (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Local Professional</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {freelancer.headline}
              </p>

              {/* Clean unboxed metadata with bullet separators */}
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
                <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{freelancer.location}</span>
                </span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{freelancer.rating.toFixed(2)}</span>
                  <span className="text-neutral-400 dark:text-neutral-500 font-normal">({freelancer.reviewCount} local reviews)</span>
                </span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span>{freelancer.experienceYears} Years Experience</span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-neutral-700 dark:text-neutral-300">{freelancer.availability}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                <span>Languages: <strong className="font-medium text-neutral-800 dark:text-neutral-200">{freelancer.languages.join(', ')}</strong></span>
                <span>·</span>
                <span>Preferred Contact: <strong className="font-medium text-neutral-800 dark:text-neutral-200">{freelancer.contactPreference}</strong></span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA Card */}
          <div className="sm:text-right shrink-0 bg-neutral-50 dark:bg-neutral-800/60 p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-medium">
                {freelancer.startingProjectRateInr > 0 ? 'Starting Project Fee' : 'Pricing Model'}
              </span>
              {freelancer.startingProjectRateInr > 0 ? (
                <p className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
                  ₹{freelancer.startingProjectRateInr.toLocaleString('en-IN')}
                </p>
              ) : (
                <p className="text-base font-bold text-neutral-900 dark:text-white">
                  Custom quote on enquiry
                </p>
              )}
              {freelancer.hourlyRateInr > 0 ? (
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">or ₹{freelancer.hourlyRateInr}/hr (Direct)</p>
              ) : (
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Flexible project-based engagements</p>
              )}
            </div>

            <div className="flex sm:flex-col gap-2">
              <button
                onClick={() => setInquiryOpen(true)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-center cursor-pointer"
              >
                Send Direct Enquiry
              </button>
              <button
                onClick={() => toggleSaveFreelancer(freelancer.id)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSaved
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-700 dark:fill-indigo-300' : ''}`} />
                <span>{isSaved ? 'Saved to Bookmarks' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Team members breakdown if agency */}
        {freelancer.isTeam && freelancer.teamMembers && (
          <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Team Members & Roles</span>
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {freelancer.teamMembers.map((m) => (
                <span key={m} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 px-3 py-1 rounded-md text-neutral-700 dark:text-neutral-300 font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid: About + Services + Portfolio + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 8 Columns: Details */}
        <div className="lg:col-span-8 space-y-10">
          {/* About / Bio */}
          <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-6 space-y-3 transition-colors">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">About & Background</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
              {freelancer.bio}
            </p>
          </section>

          {/* Core Services Offered */}
          <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-6 space-y-4 transition-colors">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Services & Pricing Guide</h3>
            {freelancer.services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freelancer.services.map((srv) => (
                  <div key={srv.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/50 dark:bg-neutral-800/40 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{srv.title}</h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">{srv.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Typical Delivery</span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{srv.deliveryTimeDays} Days</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Starting At</span>
                        <span className="font-bold text-neutral-900 dark:text-white tabular-nums">
                          ₹{srv.startingPriceInr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-2">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Custom services and deliverables tailored to your exact business requirements. Send a direct enquiry with your project outline to receive an itemized proposal.
                </p>
                <button
                  type="button"
                  onClick={() => setInquiryOpen(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg text-xs hover:bg-indigo-700 transition-colors"
                >
                  Inquire for Custom Quote
                </button>
              </div>
            )}
          </section>

          {/* Portfolio Projects Showcase */}
          <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Verified Work Samples & Portfolios</h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{freelancer.portfolio.length} Projects shown</span>
            </div>

            {freelancer.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {freelancer.portfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActivePortfolioModal(item)}
                    className="group cursor-pointer rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 dark:bg-neutral-800/40 hover:shadow-md transition-all"
                  >
                    <div className="h-44 overflow-hidden relative bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium border border-neutral-700">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        <span>Client: {item.clientType || 'Local'}</span>
                        <span>{item.completionYear || 'Recent'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Portfolio work samples are currently being assembled. This specialist is active and accepting local business proposals.
                </p>
              </div>
            )}
          </section>

          {/* Verified Local Client Reviews */}
          <section className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Local Business Reviews</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{freelancer.rating > 0 ? freelancer.rating.toFixed(1) : 'New'}</span>
                <span className="text-neutral-400 dark:text-neutral-500 font-normal">({freelancer.reviewCount} total reviews)</span>
              </div>
            </div>

            {freelancer.reviews.length > 0 ? (
              <div className="space-y-4">
                {freelancer.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-neutral-900 dark:text-white">{rev.clientName}</p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{rev.clientCompany || rev.clientLocation}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                      Project: {rev.projectTitle} · Verified Local Delivery
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  No public reviews published yet. Be the first local business in Maharashtra to collaborate with this pro.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right 4 Columns: Skills & Regional Trust Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Skills Breakdown */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3 transition-colors">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Skills & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {freelancer.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Local Service Region Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3 text-xs text-neutral-600 dark:text-neutral-400 transition-colors">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Service Area & Availability
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">{freelancer.areaName} Corridor</p>
                  <p className="text-neutral-500 dark:text-neutral-400">Available for in-person meetings across Boisar, Palghar, and Tarapur MIDC.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200">{freelancer.availability}</p>
                  <p className="text-neutral-500 dark:text-neutral-400">Typically responds within a few hours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Negotiation Reminder */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60 p-5 space-y-2 text-xs transition-colors">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Direct Client Negotiation</span>
            </h4>
            <p className="text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
              SkillNest operates on a local-first direct model. You negotiate project price, milestones, and deliverable terms directly with {freelancer.name} with zero platform deductions.
            </p>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        freelancer={freelancer}
      />

      {/* Portfolio Item Detail Modal */}
      {activePortfolioModal && (
        <Modal
          isOpen={true}
          onClose={() => setActivePortfolioModal(null)}
          title={activePortfolioModal.title}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 max-h-80 bg-neutral-100 dark:bg-neutral-800">
              <img
                src={activePortfolioModal.imageUrl}
                alt={activePortfolioModal.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                <span>{activePortfolioModal.category}</span>
                <span>Completed: {activePortfolioModal.completionYear}</span>
              </div>
              <h4 className="text-lg font-bold text-neutral-900 dark:text-white">{activePortfolioModal.title}</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                {activePortfolioModal.description}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">Technologies & Tools Used:</p>
              <div className="flex flex-wrap gap-1.5">
                {activePortfolioModal.skillsUsed.map(s => (
                  <span key={s} className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-700 dark:text-neutral-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Client: {activePortfolioModal.clientType}</span>
              <button
                onClick={() => {
                  setActivePortfolioModal(null);
                  setInquiryOpen(true);
                }}
                className="py-2 px-4 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
              >
                Enquire for Similar Project
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
