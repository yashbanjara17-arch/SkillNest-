import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/projects/ProjectCard';
import { SERVICE_CATEGORIES, REGIONS_SERVED } from '../data/mockData';
import { Search, MapPin, PlusCircle, RotateCcw, Briefcase, Filter } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open'>('Open');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchDesc = project.description.toLowerCase().includes(q);
        const matchSkills = project.requiredSkills.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSkills) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && project.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedArea !== 'All') {
        const pArea = (project.preferredArea || project.clientLocation).toLowerCase();
        if (!pArea.includes(selectedArea.toLowerCase())) return false;
      }

      // Status filter
      if (statusFilter === 'Open' && project.status !== 'Open') {
        return false;
      }

      return true;
    });
  }, [projects, query, selectedCategory, selectedArea, statusFilter]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('All');
    setSelectedArea('All');
    setStatusFilter('Open');
  };

  const hasActiveFilters = query !== '' || selectedCategory !== 'All' || selectedArea !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Opportunities In Boisar, Palghar & Maharashtra</span>
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Discover Local Projects
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
            Browse genuine client requirements from local restaurants, factories, clinics, and businesses looking for nearby talent.
          </p>
        </div>

        <Link
          to="/post-project"
          className="self-start sm:self-auto px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Requirement</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-3 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keywords, required skills, or industry..."
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200"
            >
              <option value="All">All Categories</option>
              {SERVICE_CATEGORIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full text-xs px-3 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-200"
            >
              <option value="All">All Preferred Areas</option>
              {REGIONS_SERVED.map(r => (
                <option key={r.name} value={r.name}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">
              Active filters applied
            </span>
            <button
              onClick={handleResetFilters}
              className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Projects Count */}
      <div className="text-xs text-neutral-500 dark:text-neutral-400">
        Showing <span className="font-bold text-neutral-900 dark:text-white tabular-nums">{filteredProjects.length}</span> active project opportunities
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-full flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">No projects match your filter</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Try removing some search keywords or checking all categories.
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
