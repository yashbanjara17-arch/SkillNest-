import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES, REGIONS_SERVED } from '../data/mockData';
import { calculateFreelancerMatch } from '../utils/matching';
import { GlassCard } from '../components/ui/GlassCard';
import { 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  X, 
  IndianRupee, 
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Building2,
  Globe,
  Palette,
  TrendingUp,
  Video,
  Cpu,
  PenTool,
  Clock
} from 'lucide-react';

export const PostProjectPage: React.FC = () => {
  const { postProject, currentUser, freelancers, addToast } = useApp();
  const navigate = useNavigate();

  // Multi-step state: 1 (Category & Title) -> 2 (Details & Skills) -> 3 (Budget & Location) -> 4 (Review)
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [title, setTitle] = useState('Website & QR Photo Menu for Local Cafe');
  const [category, setCategory] = useState(SERVICE_CATEGORIES[0].name);
  const [description, setDescription] = useState(
    'We run a restaurant in Boisar and need a modern, mobile-friendly website where customers can view our food menu, check daily specials, and get directions. We would prefer to meet in person to review the layout.'
  );
  const [skills, setSkills] = useState<string[]>(['React', 'Tailwind CSS', 'Mobile-Friendly']);
  const [skillInput, setSkillInput] = useState('');
  const [preferredArea, setPreferredArea] = useState('Boisar');
  const [budgetMin, setBudgetMin] = useState('18000');
  const [budgetMax, setBudgetMax] = useState('30000');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [timeline, setTimeline] = useState('2-3 weeks');
  const [contactPreference, setContactPreference] = useState('In-person Meeting at Cafe / Office');

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Category icons for non-technical selection
  const categoryIcons: Record<string, React.ReactNode> = {
    'Web & App Development': <Globe className="w-5 h-5 text-indigo-400" />,
    'UI/UX & Graphic Design': <Palette className="w-5 h-5 text-violet-400" />,
    'Digital Marketing & SEO': <TrendingUp className="w-5 h-5 text-emerald-400" />,
    'Video & Media Production': <Video className="w-5 h-5 text-rose-400" />,
    'Industrial & CAD Engineering': <Cpu className="w-5 h-5 text-sky-400" />,
    'Content & Copywriting': <PenTool className="w-5 h-5 text-amber-400" />,
  };

  const liveMatches = useMemo(() => {
    return freelancers
      .map(fl => ({
        freelancer: fl,
        match: calculateFreelancerMatch(fl, {
          requiredSkills: skills,
          category,
          preferredArea
        })
      }))
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, 3);
  }, [freelancers, skills, category, preferredArea]);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!title.trim() || title.trim().length < 5) {
      errs.title = 'Please provide a simple title (e.g. Website for cafe, Logo design).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!description.trim() || description.trim().length < 20) {
      errs.description = 'Please write a sentence or two explaining what you need help with.';
    }
    if (skills.length === 0) {
      errs.skills = 'Please pick at least one skill or category tag.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (Number(budgetMin) <= 0 || Number(budgetMax) <= 0 || Number(budgetMax) < Number(budgetMin)) {
      errs.budget = 'Maximum budget must be equal to or greater than minimum.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = postProject({
      title: title.trim(),
      category,
      description: description.trim(),
      requiredSkills: skills,
      clientLocation: `${preferredArea}, Palghar Dist.`,
      preferredArea,
      budgetMinInr: Number(budgetMin),
      budgetMaxInr: Number(budgetMax),
      isBudgetNegotiable: isNegotiable,
      timeline,
      preferredWorkerType: 'Any',
      contactPreference
    });
    setSubmittedId(newId);
  };

  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">Your Project is Published!</h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 max-w-md mx-auto leading-relaxed">
            Local professionals in <span className="text-neutral-900 dark:text-white font-semibold">{preferredArea}</span> have been matched to your requirement. You can compare their portfolios and discuss terms directly.
          </p>
        </div>

        <div className="p-5 text-left text-xs space-y-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <p className="font-bold text-neutral-900 dark:text-white text-sm">{title}</p>
          <p className="text-neutral-600 dark:text-neutral-400">Location: {preferredArea} · Budget: ₹{Number(budgetMin).toLocaleString('en-IN')} – ₹{Number(budgetMax).toLocaleString('en-IN')}</p>
          <div className="flex flex-wrap gap-1 pt-1">
            {skills.map(s => (
              <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={`/project/${submittedId}`}
            className="py-2.5 px-5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-sm"
          >
            View Project Listing
          </Link>
          <Link
            to="/client/projects"
            className="py-2.5 px-5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Go to My Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Friendly Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
          <Building2 className="w-3.5 h-3.5" />
          <span>Local Client Helper · No Technical Experience Needed</span>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          What do you need help with?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
          Post your requirement in four quick steps. We connect you with verified local talent in Boisar, Palghar, and nearby areas.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { num: 1, title: 'Service & Title' },
          { num: 2, title: 'Your Requirement' },
          { num: 3, title: 'Location & Budget' },
          { num: 4, title: 'Review & Publish' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-xl border text-center transition-all ${
              currentStep === s.num
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                : currentStep > s.num
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500'
            }`}
          >
            <span className="text-[10px] block opacity-70">Step 0{s.num}</span>
            <span className="text-xs truncate block">{s.title}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 text-xs shadow-xs transition-colors">
          {/* STEP 1: Service Category & Title */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Select the service you need</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">Click the category that best matches what you want built:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat.name;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-white shadow-xs'
                          : 'bg-neutral-50/60 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <span className="p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-2xs shrink-0">
                        {categoryIcons[cat.name] || <Globe className="w-5 h-5 text-indigo-500" />}
                      </span>
                      <div>
                        <p className="font-bold text-xs text-neutral-900 dark:text-white">{cat.name}</p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Project Title (Plain & Simple)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Online website for our Boisar bakery"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-indigo-500 text-xs shadow-2xs"
                />
                {errors.title && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div className="flex justify-end pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Description & Skills */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Describe what you need help with</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">Use your everyday words. Local freelancers understand:</p>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  What should this project deliver?
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. We want to accept online orders for our cake shop. We have a photo menu and need someone in Boisar who can visit us and explain how it works."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-indigo-500 text-xs resize-none leading-relaxed shadow-2xs"
                />
                {errors.description && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Key Skills or Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(skillInput);
                      }
                    }}
                    placeholder="Type skill tag (e.g. React, Menu, Branding) and press Enter"
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none focus:border-indigo-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(skillInput)}
                    className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl font-semibold transition-colors"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-1.5 font-medium"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="hover:text-indigo-900 dark:hover:text-white"
                        aria-label={`Remove ${s}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.skills && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.skills}</p>}
              </div>

              <div className="flex justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Continue to Budget</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Budget */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Location & Budget Terms</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">Where is your business located and what is your budget range?</p>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Preferred Location in Maharashtra
                </label>
                <select
                  value={preferredArea}
                  onChange={(e) => setPreferredArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none focus:border-indigo-500 shadow-2xs"
                >
                  {REGIONS_SERVED.map((reg) => (
                    <option key={reg.name} value={reg.name} className="dark:bg-neutral-900">{reg.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
                  Your Budget Range (INR)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mb-0.5">Minimum ₹</span>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-bold text-xs outline-none shadow-2xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mb-0.5">Maximum ₹</span>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-bold text-xs outline-none shadow-2xs"
                    />
                  </div>
                </div>
                {errors.budget && <p className="text-rose-600 dark:text-rose-400 text-xs mt-1">{errors.budget}</p>}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="neg-check"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <label htmlFor="neg-check" className="text-neutral-700 dark:text-neutral-300 cursor-pointer text-xs">
                  Budget is open to direct negotiation based on portfolio quality
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Expected Timeline</label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none shadow-2xs"
                  >
                    <option value="Under 1 week" className="dark:bg-neutral-900">Under 1 week</option>
                    <option value="2-3 weeks" className="dark:bg-neutral-900">2-3 weeks</option>
                    <option value="1 month" className="dark:bg-neutral-900">1 month</option>
                    <option value="2-3 months" className="dark:bg-neutral-900">2-3 months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">Communication Preference</label>
                  <select
                    value={contactPreference}
                    onChange={(e) => setContactPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs outline-none shadow-2xs"
                  >
                    <option value="In-person Meeting at Cafe / Office" className="dark:bg-neutral-900">In-person Meeting First</option>
                    <option value="Phone & WhatsApp" className="dark:bg-neutral-900">Phone & WhatsApp</option>
                    <option value="SkillNest Direct Message" className="dark:bg-neutral-900">SkillNest Portal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Review Project Summary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Publish */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Review Before Publishing</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">Check your requirement summary before making it visible to nearby professionals:</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">{category}</span>
                  <span>{preferredArea}</span>
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">{title}</h4>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-xs">{description}</p>
                <div className="flex items-center gap-4 pt-2 border-t border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span>Budget: <strong className="text-neutral-900 dark:text-white font-bold">₹{Number(budgetMin).toLocaleString('en-IN')} - ₹{Number(budgetMax).toLocaleString('en-IN')}</strong></span>
                  <span>·</span>
                  <span>Timeline: <strong className="text-neutral-800 dark:text-neutral-200">{timeline}</strong></span>
                  <span>·</span>
                  <span>{isNegotiable ? 'Negotiable' : 'Fixed'}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                ✓ <strong>Zero platform fees:</strong> You negotiate and pay the freelancer directly. SkillNest never takes a cut of your project budget.
              </div>

              <div className="flex justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Edit</span>
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Project to SkillNest</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Matching Preview Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl space-y-4 shadow-xs transition-colors">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Live Matching Talent in {preferredArea}
              </h3>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              As you fill out this form, our engine finds suitable specialists in Boisar, Palghar, and nearby areas:
            </p>

            <div className="space-y-3">
              {liveMatches.map(({ freelancer, match }) => (
                <div key={freelancer.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 space-y-1.5 text-xs transition-colors">
                  <div className="flex items-start gap-2.5">
                    <img src={freelancer.avatar} alt={freelancer.name} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-neutral-200 dark:border-neutral-700" />
                    <div className="min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-white truncate">{freelancer.name}</span>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 tabular-nums shrink-0">{match.score}% Match</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">{freelancer.headline}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-indigo-600 dark:text-indigo-300 font-medium">
                    {match.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
