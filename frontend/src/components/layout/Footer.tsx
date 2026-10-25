import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                SN
              </span>
              <span className="text-xl font-bold tracking-tight text-white">SkillNest</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              The Right Skills, Right Around You. A local-first marketplace empowering businesses across Boisar, Palghar, Tarapur, and Maharashtra to discover verified local talent and collaborate with zero platform commissions on project fees.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Primary Hub: Boisar Station Rd & Tarapur MIDC Corridor, Palghar Dist. 401501</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>contact@skillnest.local · Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+91 (02525) 27-SKILL / Support Desk</span>
              </div>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/freelancers" className="hover:text-white transition-colors">Explore Freelancers</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">Find Local Projects</Link>
              </li>
              <li>
                <Link to="/post-project" className="hover:text-white transition-colors">Post a Client Requirement</Link>
              </li>
              <li>
                <Link to="/freelancers?category=Web+%26+App+Development" className="hover:text-white transition-colors">Web & Software Dev</Link>
              </li>
              <li>
                <Link to="/freelancers?category=UI%2FUX+%26+Graphic+Design" className="hover:text-white transition-colors">Design & Branding</Link>
              </li>
              <li>
                <Link to="/freelancers?category=Industrial+%26+CAD+Engineering" className="hover:text-white transition-colors">Industrial CAD & Tools</Link>
              </li>
            </ul>
          </div>

          {/* Regional Hubs */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-3">Service Regions</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/freelancers?area=Boisar" className="hover:text-white transition-colors">Boisar City & Railway</Link>
              </li>
              <li>
                <Link to="/freelancers?area=Tarapur+MIDC" className="hover:text-white transition-colors">Tarapur MIDC Industrial</Link>
              </li>
              <li>
                <Link to="/freelancers?area=Palghar" className="hover:text-white transition-colors">Palghar District HQ</Link>
              </li>
              <li>
                <Link to="/freelancers?area=Dahanu" className="hover:text-white transition-colors">Dahanu & Gholvad Agro</Link>
              </li>
              <li>
                <Link to="/freelancers?area=Virar" className="hover:text-white transition-colors">Virar & North MMR</Link>
              </li>
              <li>
                <Link to="/freelancers?area=Remote" className="hover:text-white transition-colors">Remote / Virtual First</Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How SkillNest Works</Link>
              </li>
              <li>
                <Link to="/how-it-works#comparison" className="hover:text-white transition-colors">Platform Comparison</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">User Sign In</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors">Register Account</Link>
              </li>
              <li className="pt-2">
                <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Local Talent</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SkillNest Technologies. All rights reserved. Designed for local commerce in Maharashtra.</p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-400 hidden md:inline">Direct Pricing · Transparent Portfolios · No Hidden Commissions</span>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Theme:</span>
              <ThemeToggle showLabel />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
