import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  X, 
  PlusCircle, 
  ChevronDown, 
  LogOut, 
  Briefcase, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  User, 
  FileText 
} from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const Navbar: React.FC = () => {
  const { currentUser, currentFreelancerProfile, logout } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Check freelancer profile completion
  const isProfileComplete = Boolean(
    currentFreelancerProfile &&
    currentFreelancerProfile.headline?.trim() &&
    currentFreelancerProfile.skills &&
    currentFreelancerProfile.skills.length >= 3 &&
    currentFreelancerProfile.portfolio &&
    currentFreelancerProfile.portfolio.length > 0 &&
    (Number(currentFreelancerProfile.startingProjectRateInr) > 0 || Number(currentFreelancerProfile.hourlyRateInr) > 0)
  );

  const getWorkspacePath = () => {
    if (currentUser?.role === 'admin') return '/admin';
    if (currentUser?.role === 'freelancer') return '/dashboard/freelancer';
    return '/dashboard/client';
  };

  const getWorkspaceLabel = () => {
    if (currentUser?.role === 'admin') return 'Admin Dashboard';
    if (currentUser?.role === 'freelancer') return 'Freelancer Hub';
    return 'Client Dashboard';
  };

  // Build role-specific navigation links
  const getNavLinks = () => {
    if (!currentUser) {
      // Guest (Not Logged In)
      return [
        { label: 'Find Freelancers', path: '/freelancers' },
        { label: 'Browse Projects', path: '/projects' },
        { label: 'How It Works', path: '/how-it-works' },
      ];
    }

    if (currentUser.role === 'client') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Find Freelancers', path: '/freelancers' },
        { label: 'Browse Projects', path: '/projects' },
        { label: 'How It Works', path: '/how-it-works' },
        { label: 'Client Dashboard', path: '/dashboard/client' },
      ];
    }

    if (currentUser.role === 'freelancer') {
      // Freelancer: DO NOT show 'Find Freelancers' as primary nav item
      return [
        { label: 'Home', path: '/' },
        { label: 'Browse Projects', path: '/projects' },
        { label: 'How It Works', path: '/how-it-works' },
        { label: 'Freelancer Hub', path: '/dashboard/freelancer' },
      ];
    }

    if (currentUser.role === 'admin') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Find Freelancers', path: '/freelancers' },
        { label: 'Browse Projects', path: '/projects' },
        { label: 'How It Works', path: '/how-it-works' },
        { label: 'Admin Dashboard', path: '/admin' },
      ];
    }

    return [
      { label: 'Find Freelancers', path: '/freelancers' },
      { label: 'Browse Projects', path: '/projects' },
      { label: 'How It Works', path: '/how-it-works' },
    ];
  };

  const navLinks = getNavLinks();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <Link 
          to="/" 
          className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2 group"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            SN
          </span>
          <span className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-indigo-900 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent font-extrabold">
            SkillNest
          </span>
        </Link>

        {/* Zone 2: Role-aware navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`whitespace-nowrap shrink-0 transition-all py-1 ${
                isActive(link.path)
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Primary Action + Theme Toggle + User Persona / Auth Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Client Primary Action: Post a Project */}
          {currentUser?.role === 'client' && (
            <Link
              to="/post-project"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Project</span>
            </Link>
          )}

          {/* Freelancer Primary Action: Complete My Profile or Manage Portfolio */}
          {currentUser?.role === 'freelancer' && (
            <Link
              to={isProfileComplete ? '/freelancer/portfolio' : '/freelancer/profile'}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              {isProfileComplete ? (
                <>
                  <Layers className="w-3.5 h-3.5" />
                  <span>Manage Portfolio</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complete My Profile</span>
                </>
              )}
            </Link>
          )}

          {/* Theme Mode Toggle */}
          <ThemeToggle />

          {/* Logged In User Pill & Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs transition-colors backdrop-blur-md cursor-pointer"
                title="Account Menu"
                aria-expanded={userDropdownOpen}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                />
                <span className="hidden lg:inline-block font-bold truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-extrabold bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white/95 dark:bg-neutral-900/95 rounded-2xl shadow-xl shadow-neutral-900/10 border border-neutral-200/90 dark:border-neutral-800 py-2.5 z-50 text-xs text-neutral-700 dark:text-neutral-300 backdrop-blur-xl animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                    <p className="font-bold text-neutral-900 dark:text-white text-sm">{currentUser.name}</p>
                    <p className="text-neutral-500 text-[11px] truncate">{currentUser.email}</p>
                    <p className="text-neutral-400 text-[10px] mt-0.5">{currentUser.organization || currentUser.location || 'Local User'}</p>
                  </div>

                  <div className="py-1 px-2 space-y-0.5">
                    <Link
                      to={getWorkspacePath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>{getWorkspaceLabel()}</span>
                    </Link>

                    {currentUser.role === 'freelancer' && (
                      <>
                        <Link
                          to="/freelancer/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Edit Profile & Services</span>
                        </Link>
                        <Link
                          to="/freelancer/portfolio"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          <Layers className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Manage Portfolio</span>
                        </Link>
                      </>
                    )}

                    {currentUser.role === 'client' && (
                      <>
                        <Link
                          to="/post-project"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>Post a Project</span>
                        </Link>
                        <Link
                          to="/client/projects"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium"
                        >
                          <FileText className="w-3.5 h-3.5 text-neutral-500" />
                          <span>My Posted Projects</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800 mt-1 pt-1 px-2">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Auth CTAs */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-2 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <div className="relative group">
                <Link
                  to="/signup"
                  className="text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 px-3.5 py-2 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1"
                >
                  <span>Get Started</span>
                  <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
                </Link>
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                  <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 p-1.5 text-xs">
                    <Link
                      to="/signup?role=client"
                      className="block px-3 py-2 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                    >
                      Hire Freelancers (Client)
                    </Link>
                    <Link
                      to="/signup?role=freelancer"
                      className="block px-3 py-2 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                    >
                      Offer Skills (Freelancer)
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Appearance</span>
            <ThemeToggle showLabel />
          </div>

          {/* Role-Specific Primary Mobile Action */}
          {currentUser?.role === 'client' && (
            <div className="pt-1">
              <Link
                to="/post-project"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post a Project</span>
              </Link>
            </div>
          )}

          {currentUser?.role === 'freelancer' && (
            <div className="pt-1">
              <Link
                to={isProfileComplete ? '/freelancer/portfolio' : '/freelancer/profile'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-xl shadow-xs"
              >
                {isProfileComplete ? (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Manage Portfolio</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Complete My Profile</span>
                  </>
                )}
              </Link>
            </div>
          )}

          {!currentUser && (
            <div className="pt-2 space-y-2 border-t border-neutral-100 dark:border-neutral-800">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Sign In
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/signup?role=client"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl text-center"
                >
                  Hire Talent
                </Link>
                <Link
                  to="/signup?role=freelancer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2 text-xs font-semibold text-neutral-900 bg-neutral-200 dark:bg-neutral-800 dark:text-white rounded-xl text-center"
                >
                  Join as Pro
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
