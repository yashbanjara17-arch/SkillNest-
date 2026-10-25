import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ArrowRight,
  HelpCircle,
  IndianRupee,
  PhoneCall
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does SkillNest take a commission on project fees?',
      a: 'No. SkillNest operates on a 0% commission model for project transactions. Clients and freelancers agree on project milestones, rates, and payment methods directly without third-party deductions.'
    },
    {
      q: 'Why should I hire locally in Boisar or Palghar instead of on global sites?',
      a: 'Local collaboration allows you to meet at your restaurant or factory, verify past deliverables with regional businesses, communicate across the same time zone, and build sustained long-term accountability.'
    },
    {
      q: 'Can freelance agencies or multi-member teams list on SkillNest?',
      a: 'Yes. SkillNest supports both individual freelancers and multi-member agencies/collectives. Teams can highlight their combined members, roles, and multidisciplinary capabilities.'
    },
    {
      q: 'How does the transparent matching algorithm work?',
      a: 'Our rule-based engine scores candidates on skills overlap (50%), geographic proximity (30%), and verified experience and ratings (20%). It provides an explicit human explanation (e.g. "Matches 4/4 skills · Located in Boisar · 4.9★ rating") without black-box bias.'
    },
    {
      q: 'How do clients and freelancers handle payments safely?',
      a: 'We recommend structured milestone payments: a 25-30% initial deposit upon contract agreement, 40% upon prototype delivery, and the remainder upon final sign-off and deployment directly via bank transfer or UPI.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/60">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Local Marketplace Playbook</span>
        </div>
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          How SkillNest Connects Local Commerce
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          SkillNest is designed from the ground up for small businesses and independent talent in Boisar, Palghar, Tarapur MIDC, and Maharashtra who value direct relationships over faceless platforms.
        </p>
      </div>

      {/* Two Pillars: Business vs Freelancer journeys */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Journey 1: Business */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">For Businesses & Clients</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">How to find and hire nearby professionals</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">01</span>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Post Your Project Scope</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Specify what you need built, your preferred location in Palghar district, estimated budget range, and timeline expectations.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">02</span>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Review Portfolios & Match Scores</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Compare candidates who have completed genuine work for local businesses. Filter by proximity or agency team size.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">03</span>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Meet or Call to Agree on Milestones</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Meet in person in Boisar or Palghar, clarify requirements face-to-face, and finalize your agreement with 0% platform deductions.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/post-project"
            className="block text-center py-2.5 px-4 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Post a Requirement Now
          </Link>
        </div>

        {/* Journey 2: Freelancers */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">For Freelancers & Teams</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">How to attract projects and grow local reputation</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">01</span>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Build a Local-Verified Profile</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Upload screenshots of delivered websites, CAD models, branding, or drone footage. Mention languages and your physical service area.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">02</span>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Receive Inquiries & Discover Projects</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Get direct inquiries from local business founders or apply with substantive project proposals on posted requirements.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">03</span>
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-white text-sm">Keep 100% of What You Bill</h4>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  No 20% platform cut. Build long-term client relationships and receive repeat work from businesses in your neighborhood.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/signup?role=freelancer"
            className="block text-center py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs"
          >
            Create Freelancer Profile
          </Link>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-xs space-y-6 transition-colors" id="comparison">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Fair & Balanced Platform Comparison
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Understanding when to use SkillNest versus global marketplaces or informal local referrals.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Criteria</th>
                <th className="py-3 px-4 font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40">SkillNest</th>
                <th className="py-3 px-4 font-semibold">Upwork / Fiverr</th>
                <th className="py-3 px-4 font-semibold">WhatsApp Groups / Referrals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Geographic Proximity</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 font-medium">Hyper-local (Boisar, Palghar, MMR)</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Global (worldwide)</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Local, but limited to personal friends</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Platform Commissions</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 font-medium">0% on completed projects</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">10% - 20% platform deduction</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">0%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">In-Person Feasibility</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 font-medium">High (same town / district)</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Rarely possible (often prohibited)</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">High</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Portfolio Structure</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 font-medium">Standardized portfolios with local references</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Extensive global work samples</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Unstructured messages, PDFs</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Team / Agency Support</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-200 font-medium">First-class agency and solo profiles</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Individual focused</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Difficult to vet entire teams</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-xs space-y-6 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Clear answers to common questions about SkillNest</p>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-semibold text-neutral-900 dark:text-white text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 dark:text-neutral-500 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
