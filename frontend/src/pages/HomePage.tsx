import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FreelancerCard } from '../components/freelancers/FreelancerCard';
import { SERVICE_CATEGORIES, REGIONS_SERVED } from '../data/mockData';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  SlidersHorizontal, 
  Building2, 
  Sparkles, 
  MessageSquare, 
  Award 
} from 'lucide-react';
import { heroMarketplace } from '../assets/images';

export const HomePage: React.FC = () => {
  const { freelancers } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [howItWorksTab, setHowItWorksTab] = useState<'client' | 'freelancer'>('client');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedArea !== 'All') params.append('area', selectedArea);
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    navigate(`/freelancers?${params.toString()}`);
  };

  const featuredFreelancers = freelancers.slice(0, 3);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-12 lg:pb-16 bg-gradient-to-b from-white via-neutral-50/50 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900/40 dark:to-neutral-950 border-b border-neutral-200/60 dark:border-neutral-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Proposition & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/60">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Local-First Freelance Network · Boisar, Palghar & Maharashtra</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.12] text-balance">
                Find the Right Talent, <br className="hidden sm:inline" />
                <span className="text-indigo-600 dark:text-indigo-400">Right Around You.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                Connect with skilled local freelancers and teams for your next project. Compare real portfolios, discover nearby professionals in Boisar and Palghar, and work together on your terms.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/freelancers"
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/10 transition-all flex items-center gap-2"
                >
                  <span>Find a Freelancer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/signup?role=freelancer"
                  className="px-6 py-3.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                >
                  Join as a Freelancer
                </Link>
              </div>

              {/* Integrated Search Box */}
              <form 
                onSubmit={handleHeroSearch}
                className="mt-6 p-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg shadow-neutral-900/5 dark:shadow-black/40 grid grid-cols-1 sm:grid-cols-12 gap-2 transition-colors"
              >
                <div className="sm:col-span-5 relative flex items-center px-3">
                  <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Skill or service (e.g. React, Logo, SEO)..."
                    className="w-full text-xs pl-6 pr-2 py-2 outline-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-transparent"
                  />
                </div>

                <div className="sm:col-span-3 border-t sm:border-t-0 sm:border-l border-neutral-100 dark:border-neutral-800 flex items-center px-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 mr-1.5 shrink-0" />
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full text-xs py-2 bg-transparent outline-none text-neutral-700 dark:text-neutral-300 dark:bg-neutral-900"
                  >
                    <option value="All">All Locations</option>
                    {REGIONS_SERVED.map(r => (
                      <option key={r.name} value={r.name} className="dark:bg-neutral-900 dark:text-neutral-200">{r.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-4 flex items-center">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-900 dark:bg-indigo-600 rounded-xl hover:bg-neutral-800 dark:hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Search Nearby</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Visual Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={heroMarketplace}
                  alt="SkillNest Local Freelancer Collaboration"
                  className="w-full h-[380px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-indigo-300 font-medium">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Real Collaboration In Your Town</span>
                  </div>
                  <h3 className="text-lg font-bold">
                    Meet In Person or Collaborate Online
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 max-w-sm">
                    From Boisar cafes to Tarapur MIDC industrial plants, review work samples with people you can actually meet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Proof & Pillar Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="space-y-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Platform Fee</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white tabular-nums">0% Commission</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Negotiate and pay directly</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Primary Focus</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">Hyper-Local</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Boisar, Palghar & MIDC</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Talent Profiles</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">Verified Work</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Actual local deliverables</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Flexible Models</p>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">Solo & Teams</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Hire an individual or agency</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Service Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Service Categories
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Popular Local Services
            </h3>
          </div>
          <Link
            to="/freelancers"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/freelancers?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200/90 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {cat.freelancerCount} available
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-1.5">
                {cat.popularSkills.slice(0, 3).map((sk) => (
                  <span key={sk} className="text-[11px] text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                    {sk}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Freelancers & Teams */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Verified Talent
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Featured Freelancers & Teams
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Experienced professionals based right in Boisar, Palghar, and surrounding areas.
            </p>
          </div>
          <Link
            to="/freelancers"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore All {freelancers.length} Freelancers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFreelancers.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      </section>

      {/* 4. Interactive How SkillNest Works */}
      <section className="bg-neutral-100/70 dark:bg-neutral-900/40 border-y border-neutral-200/80 dark:border-neutral-800/80 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Workflow
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              How SkillNest Works
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Transparent, direct, and designed for local community collaboration.
            </p>

            {/* Toggle Tabs */}
            <div className="inline-flex p-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 mt-6 shadow-xs">
              <button
                onClick={() => setHowItWorksTab('client')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  howItWorksTab === 'client'
                    ? 'bg-neutral-900 dark:bg-indigo-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                For Local Businesses & Clients
              </button>
              <button
                onClick={() => setHowItWorksTab('freelancer')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  howItWorksTab === 'freelancer'
                    ? 'bg-neutral-900 dark:bg-indigo-600 text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                For Freelancers & Teams
              </button>
            </div>
          </div>

          {howItWorksTab === 'client' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Step 01</span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Post Your Requirement</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Describe what your business needs — whether it's a website for a Boisar restaurant, an inventory tool for a Tarapur factory, or packaging for Dahanu farm produce.
                </p>
                <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Takes under 2 minutes · Free to post
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Step 02</span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Compare Portfolios Nearby</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  SkillNest transparently shows matching professionals based on skills, past local projects, and distance. Review real portfolio screenshots and verified local client reviews.
                </p>
                <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Rule-based matching · Transparent rankings
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Step 03</span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Direct Contact & Negotiation</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Call, WhatsApp, or meet for coffee in Boisar or Palghar. Agree on project scope and pricing directly with no 20% commission taken from either party.
                </p>
                <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Direct relationship · 0% intermediary fee
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Step 01</span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Showcase Your Local Work</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Create a profile highlighting your technical skills, portfolio projects delivered in Maharashtra, service pricing guides, and whether you work solo or as an agency team.
                </p>
                <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Solo or team profiles supported
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Step 02</span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Discover Relevant Nearby Projects</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Browse projects posted by local businesses who prefer working with nearby professionals. Filter by location (Boisar, Palghar, Tarapur MIDC, Dahanu, Virar).
                </p>
                <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Real client requirements · No ghost postings
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">Step 03</span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">Pitch & Keep 100% of Your Earnings</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Submit transparent proposals and explain your approach. Negotiate payment milestones directly with the business. Keep every rupee you earn.
                </p>
                <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Zero commission deductions
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Objective Platform Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="comparison">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            Differentiation
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            How SkillNest Compares to Alternatives
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Global platforms excel at overseas outsourcing. SkillNest is built specifically for local trust, nearby accountability, and direct communication.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Feature / Attribute</th>
                <th className="py-3 px-4 font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40">SkillNest (Local First)</th>
                <th className="py-3 px-4 font-semibold">Global Marketplaces (Fiverr / Upwork)</th>
                <th className="py-3 px-4 font-semibold">Informal Local Word-of-Mouth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Target Proximity</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 font-medium text-indigo-950 dark:text-indigo-200">
                  Nearby / Same Region (Boisar, Palghar, etc.)
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Global / Dispersed across countries</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Immediate personal circle only</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">In-Person Meetings</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 font-medium text-indigo-950 dark:text-indigo-200">
                  Supported & Encouraged (Local cafes, offices)
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Strictly discouraged or prohibited in ToS</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Possible, but limited candidate choices</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Platform Project Fee</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 font-medium text-indigo-950 dark:text-indigo-200">
                  0% Commission on project fees
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">10% - 20% platform cut on all payments</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">0% fee</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Portfolio Verification</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 font-medium text-indigo-950 dark:text-indigo-200">
                  Local business references you can verify
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Global reviews with varying authenticity</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">No standardized portfolio view</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Agency / Team Support</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 font-medium text-indigo-950 dark:text-indigo-200">
                  First-class support for solo & small teams
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Primarily individual profiles</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Difficult to find multi-skill teams</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">Price Negotiation</td>
                <td className="py-3 px-4 bg-indigo-50/20 dark:bg-indigo-950/20 font-medium text-indigo-950 dark:text-indigo-200">
                  Direct mutual agreement on terms & milestones
                </td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Platform-mediated escrow with strict disputes</td>
                <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">Informal, often unwritten terms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Real Local Use Cases Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            Proven Scenarios
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
            Built for Real Businesses in the Region
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Retail & Hospitality</span>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Cafe Palms, Boisar
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Needed a high-speed digital menu and Google Maps search presence so rail travelers and locals easily find the cafe. Hired a local developer who came over for testing in person.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-between">
              <span>QR Menu & Local SEO</span>
              <span>Delivered in 10 Days</span>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Manufacturing & MIDC</span>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Tarapur Precision Forgings
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Replaced manual dispatch registers with an internal web portal. Worked with an engineer who understood local factory floor constraints and barcode scanner setups.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-between">
              <span>Factory Dispatch Web App</span>
              <span>Delivered in 3 Weeks</span>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Agro & FMCG</span>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Dahanu Fruit Orchards
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Needed modern eco-friendly packaging design for dried chikoo snacks and coordinated directly with local offset printing presses in Palghar district.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-between">
              <span>Packaging & Brand Identity</span>
              <span>Delivered in 2 Weeks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 dark:bg-neutral-900/90 rounded-2xl p-8 sm:p-12 text-white text-center space-y-6 relative overflow-hidden border border-neutral-800 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Hire or Offer Skills Locally?
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Join businesses and skilled professionals across Boisar, Palghar, and Maharashtra on SkillNest. Direct collaboration with no middleman barriers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/post-project"
              className="px-6 py-3 text-xs font-semibold text-neutral-950 bg-white rounded-xl hover:bg-neutral-100 transition-colors shadow-sm"
            >
              Post a Project Requirement
            </Link>
            <Link
              to="/freelancers"
              className="px-6 py-3 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Explore Freelancers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
