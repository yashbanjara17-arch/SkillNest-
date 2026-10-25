import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  PlusCircle, 
  MessageSquare, 
  Bookmark, 
  User, 
  Search, 
  Layers, 
  Shield, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  FileText,
  Sliders,
  CheckCircle,
  HelpCircle,
  Users,
  Grid,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../common/ThemeToggle';

interface WorkspaceShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  children,
  title,
  subtitle,
  action,
}) => {
  const { currentUser, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const role = currentUser?.role || 'client';

  interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    highlight?: boolean;
  }

  // Navigation configurations tailored precisely for each role
  const clientNav: NavItem[] = [
    { label: 'Client Dashboard', path: '/dashboard/client', icon: Grid },
    { label: 'Post a Project', path: '/post-project', icon: PlusCircle, highlight: true },
    { label: 'My Projects', path: '/client/projects', icon: Briefcase },
    { label: 'Find Freelancers', path: '/freelancers', icon: Search },
    { label: 'Messages & Enquiries', path: '/client/messages', icon: MessageSquare },
    { label: 'Saved Freelancers', path: '/client/saved', icon: Bookmark },
    { label: 'Business Profile', path: '/client/profile', icon: User },
  ];

  const freelancerNav: NavItem[] = [
    { label: 'Freelancer Dashboard', path: '/dashboard/freelancer', icon: Grid },
    { label: 'Browse Local Projects', path: '/projects', icon: Search },
    { label: 'My Applications', path: '/freelancer/applications', icon: FileText },
    { label: 'My Portfolio', path: '/freelancer/portfolio', icon: Layers },
    { label: 'Client Inquiries', path: '/freelancer/inquiries', icon: MessageSquare },
    { label: 'Saved Projects', path: '/freelancer/saved', icon: Bookmark },
    { label: 'My Profile & Services', path: '/freelancer/profile', icon: User },
  ];

  const adminNav: NavItem[] = [
    { label: 'Platform Overview', path: '/admin', icon: Grid },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Project Moderation', path: '/admin/projects', icon: Briefcase },
    { label: 'Reviews & Feedback', path: '/admin/reviews', icon: CheckCircle },
    { label: 'Platform Settings', path: '/admin/settings', icon: Sliders },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'freelancer' ? freelancerNav : clientNav;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-16 z-30 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {role.toUpperCase()} WORKSPACE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle workspace menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Workspace Sidebar */}
      <aside
        className={cn(
          'w-full md:w-64 bg-white/95 dark:bg-neutral-950/90 backdrop-blur-xl border-r border-neutral-200 dark:border-neutral-800/80 p-5 flex flex-col justify-between shrink-0 transition-colors z-30',
          'md:sticky md:top-16 md:h-[calc(100vh-4rem)]',
          mobileSidebarOpen ? 'block' : 'hidden md:flex'
        )}
      >
        <div className="space-y-6">
          {/* User Profile Capsule */}
          <div className="p-3 rounded-xl bg-neutral-100/90 dark:bg-white/5 border border-neutral-200/90 dark:border-white/10 backdrop-blur-md flex items-center gap-3 transition-colors">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-lg object-cover border border-neutral-200 dark:border-white/20 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{currentUser?.name}</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{currentUser?.organization || currentUser?.location}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {currentUser?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all group',
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                      : item.highlight
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn('w-4 h-4', active ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white')} />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Theme Toggle & Role Switcher */}
        <div className="pt-5 border-t border-neutral-200 dark:border-neutral-800/80 space-y-3 text-xs">
          {/* Theme Toggle row */}
          <div className="p-2.5 rounded-xl bg-neutral-100/80 dark:bg-white/5 border border-neutral-200/90 dark:border-white/10 flex items-center justify-between transition-colors">
            <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">Appearance</span>
            <ThemeToggle showLabel />
          </div>



          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 space-y-8 bg-neutral-50/70 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {/* Content */}
        <div>{children}</div>
      </main>
    </div>
  );
};
