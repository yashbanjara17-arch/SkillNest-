import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FreelancerCard } from '../components/freelancers/FreelancerCard';
import { SERVICE_CATEGORIES, REGIONS_SERVED } from '../data/mockData';
import { calculateFreelancerMatch } from '../utils/matching';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  LayoutGrid, 
  LayoutList, 
  Star, 
  Users, 
  Sparkles,
  Check
} from 'lucide-react';

export const FreelancersPage: React.FC = () => {
  const { freelancers } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // State initialized from URL query params
  const initialQuery = searchParams.get('q') || '';
  const initialArea = searchParams.get('area') || 'All';
  const initialCat = searchParams.get('category') || 'All';

  const [query, setQuery] = useState(initialQuery);
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [teamFilter, setTeamFilter] = useState<'All' | 'Solo' | 'Team'>('All');
  const [experienceMin, setExperienceMin] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'reviews'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and compute matches
  const filteredFreelancers = useMemo(() => {
    return freelancers
      .map(fl => {
        // Calculate match if there is a search query or category/area selected
        const match = calculateFreelancerMatch(fl, {
          requiredSkills: query ? query.split(/[\s,]+/).filter(Boolean) : [],
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          preferredArea: selectedArea !== 'All' ? selectedArea : undefined
        });

        return {
          freelancer: fl,
          matchResult: match
        };
      })
      .filter(({ freelancer: fl }) => {
        // Query match
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchName = fl.name.toLowerCase().includes(q);
          const matchHeadline = fl.headline.toLowerCase().includes(q);
          const matchSkills = fl.skills.some(s => s.toLowerCase().includes(q));
          const matchCategory = fl.category.toLowerCase().includes(q);
          if (!matchName && !matchHeadline && !matchSkills && !matchCategory) return false;
        }

        // Location area match
        if (selectedArea !== 'All') {
          if (selectedArea === 'Remote') {
            // All digital specialists can do remote
          } else if (fl.areaName !== selectedArea) {
            return false;
          }
        }

        // Category match
        if (selectedCategory !== 'All' && fl.category !== selectedCategory) {
          return false;
        }

        // Team filter
        if (teamFilter === 'Solo' && fl.isTeam) return false;
        if (teamFilter === 'Team' && !fl.isTeam) return false;

        // Experience filter
        if (fl.experienceYears < experienceMin) return false;

        // Rating filter
        if (minRating > 0 && fl.rating < minRating) return false;

        // Availability filter
        if (availabilityFilter !== 'All' && !fl.availability.includes(availabilityFilter)) return false;

        return true;
      })
      .sort((a, b) => {
        if (query.trim() || selectedArea !== 'All' || selectedCategory !== 'All') {
          // If search criteria present, prioritize match score
          if (b.matchResult.score !== a.matchResult.score) {
            return b.matchResult.score - a.matchResult.score;
          }
        }
        if (sortBy === 'rating') return b.freelancer.rating - a.freelancer.rating;
        if (sortBy === 'experience') return b.freelancer.experienceYears - a.freelancer.experienceYears;
        if (sortBy === 'reviews') return b.freelancer.reviewCount - a.freelancer.reviewCount;
        return 0;
      });
  }, [
    freelancers,
    query,
    selectedArea,
    selectedCategory,
    teamFilter,
    experienceMin,
    minRating,
    availabilityFilter,
    sortBy
  ]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedArea('All');
    setSelectedCategory('All');
    setTeamFilter('All');
    setExperienceMin(0);
    setMinRating(0);
    setAvailabilityFilter('All');
    setSortBy('rating');
    setSearchParams({});
  };

  const hasActiveFilters = 
    query !== '' || 
    selectedArea !== 'All' || 
    selectedCategory !== 'All' || 
    teamFilter !== 'All' || 
    experienceMin > 0 || 
    minRating > 0 || 
    availabilityFilter !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Local Talent Directory · Boisar, Palghar & Surrounding Districts</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Explore Local Freelancers & Teams
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
          Browse verified developers, designers, video producers, and CAD engineers. Review previous work in the local region, contact them directly, and negotiate project rates with zero platform fees.
        </p>
      </div>

      {/* Main Filter Bar & Controls */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-4 transition-colors">
        {/* Row 1: Search + Area + Category + Action */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by skill, name, or service (e.g., React, Logo, MIDC)..."
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200"
            >
              <option value="All">All Locations (Boisar & Palghar)</option>
              {REGIONS_SERVED.map(r => (
                <option key={r.name} value={r.name}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200"
            >
              <option value="All">All Service Categories</option>
              {SERVICE_CATEGORIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Quick Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Solo vs Team Segmented Buttons */}
            <div className="inline-flex bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setTeamFilter('All')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  teamFilter === 'All' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setTeamFilter('Solo')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  teamFilter === 'Solo' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setTeamFilter('Team')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  teamFilter === 'Team' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Agencies / Teams
              </button>
            </div>

            {/* Experience Filter */}
            <select
              value={experienceMin}
              onChange={(e) => setExperienceMin(Number(e.target.value))}
              className="text-xs px-2.5 py-1 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200"
            >
              <option value={0}>Any Experience</option>
              <option value={3}>3+ Years Exp</option>
              <option value={5}>5+ Years Exp</option>
            </select>

            {/* Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="text-xs px-2.5 py-1 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5★ and above</option>
              <option value={4.8}>4.8★ and above</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium text-neutral-800 dark:text-neutral-200 bg-transparent border-none outline-none dark:bg-neutral-900"
              >
                <option value="rating">Highest Rating</option>
                <option value="experience">Years of Experience</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>

            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg p-0.5 bg-neutral-50 dark:bg-neutral-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-700 shadow-xs text-neutral-900 dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white dark:bg-neutral-700 shadow-xs text-neutral-900 dark:text-white' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'}`}
                aria-label="List view"
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
        <p>
          Showing <span className="font-bold text-neutral-900 dark:text-white tabular-nums">{filteredFreelancers.length}</span> verified local talent profiles
          {selectedArea !== 'All' && <span> in <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedArea}</span></span>}
        </p>
      </div>

      {/* Freelancers List / Grid */}
      {filteredFreelancers.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredFreelancers.map(({ freelancer, matchResult }) => (
            <FreelancerCard
              key={freelancer.id}
              freelancer={freelancer}
              matchScore={matchResult.score}
              matchExplanation={matchResult.explanation}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">No matching freelancers found</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Try adjusting your search criteria, clearing the location filter, or browsing all service categories.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="py-2 px-4 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
