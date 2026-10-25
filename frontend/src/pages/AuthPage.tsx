import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Building2, Users, ArrowRight, Loader2 } from 'lucide-react';
import { authApi, ApiError } from '../lib/api';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Please provide your name or business name.'); setLoading(false); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return; }

        const res = await authApi.register({ name: name.trim(), email: email.trim().toLowerCase(), password, role });
        if (res.success && res.data) {
          const userData = res.data as Record<string, unknown>;
          login(userData.email as string, userData.role as UserRole, userData.name as string, userData.id as string);
          addToast(`Welcome to SkillNest, ${userData.name}!`, 'Account created successfully.', 'success');
          navigate(role === 'client' ? '/dashboard/client' : '/dashboard/freelancer');
        }
      } else {
        const res = await authApi.login({ email: email.trim().toLowerCase(), password });
        if (res.success && res.data) {
          const userData = res.data as Record<string, unknown>;
          login(userData.email as string, userData.role as UserRole, userData.name as string, userData.id as string);
          addToast(`Welcome back, ${userData.name}!`, undefined, 'success');
          const userRole = userData.role as string;
          if (userRole === 'admin') navigate('/admin');
          else if (userRole === 'client') navigate('/dashboard/client');
          else navigate('/dashboard/freelancer');
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to connect to the server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand & Title */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            SN
          </span>
          <span>SkillNest</span>
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          {mode === 'login' ? 'Welcome Back to SkillNest' : 'Create Your SkillNest Account'}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {mode === 'login'
            ? 'Sign in to access your local projects, proposals, and direct inquiries.'
            : 'Join the local-first network connecting businesses and talent in Boisar & Palghar.'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => { setMode('login'); setError(''); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'login' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => { setMode('signup'); setError(''); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'signup' ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-5 text-xs transition-colors">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">I want to:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                      role === 'client'
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 bg-neutral-50/50 dark:bg-neutral-800/40'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">Hire Talent</span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Post projects & discover professionals</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('freelancer')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                      role === 'freelancer'
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 bg-neutral-50/50 dark:bg-neutral-800/40'
                    }`}
                  >
                    <Users className="w-4 h-4 mb-1 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">Offer Services</span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Solo freelancer or agency team</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name / Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aniket Patil / Cafe Palms"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full text-xs px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              className="w-full text-xs px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
            />
            {mode === 'signup' && (
              <p className="text-[10px] text-neutral-400 mt-1">Minimum 8 characters required.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm text-center disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {mode === 'login' ? 'Sign In' : 'Create Free Account'}
          </button>
        </form>

        {/* Note: Demo persona switcher removed — use actual credentials after running npm run db:seed */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
            Admin registration is not available through this form.
          </p>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1">
            <ArrowRight className="w-3 h-3 inline mr-0.5" />
            After running <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">npm run db:seed</code>, use seeded credentials to log in.
          </p>
        </div>
      </div>
    </div>
  );
};
