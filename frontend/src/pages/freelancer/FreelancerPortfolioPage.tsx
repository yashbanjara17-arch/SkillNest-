import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceShell } from '../../components/layout/WorkspaceShell';
import { GlassCard } from '../../components/ui/GlassCard';
import { Modal } from '../../components/common/Modal';
import { PlusCircle, Layers, Trash2, ExternalLink } from 'lucide-react';
import { categoryTechDesign } from '../../assets/images';
import { PortfolioItem } from '../../types';

export const FreelancerPortfolioPage: React.FC = () => {
  const { currentUser, freelancers, updateFreelancerProfile, addToast } = useApp();

  const myProfile = freelancers.find(
    f => f.name === currentUser?.name || f.id === currentUser?.id
  ) || freelancers[0];

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Web Application');
  const [newClientType, setNewClientType] = useState('Local Manufacturing');
  const [newSkills, setNewSkills] = useState('React, Tailwind CSS, TypeScript');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Custom solution delivered for local business partner in Maharashtra.',
      imageUrl: categoryTechDesign,
      category: newCategory,
      completionYear: '2026',
      clientType: newClientType,
      skillsUsed: newSkills.split(',').map(s => s.trim()).filter(Boolean),
    };

    updateFreelancerProfile(myProfile.id, {
      portfolio: [newItem, ...myProfile.portfolio],
    });

    setModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDelete = (id: string) => {
    updateFreelancerProfile(myProfile.id, {
      portfolio: myProfile.portfolio.filter(p => p.id !== id),
    });
    addToast('Portfolio item removed', undefined, 'info');
  };

  return (
    <WorkspaceShell
      title="My Portfolio & Deliverables"
      subtitle="Showcase verified work completed for businesses in Boisar, Palghar, and Maharashtra"
      action={
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Work Sample</span>
        </button>
      }
    >
      <div className="space-y-6">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Showing <strong className="text-neutral-900 dark:text-white">{myProfile.portfolio.length}</strong> public portfolio items displayed on your freelancer profile:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProfile.portfolio.map((item) => (
            <GlassCard key={item.id} className="p-4 space-y-3 text-xs flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="h-40 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium">
                    {item.category}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span>Client: {item.clientType}</span>
                    <span>{item.completionYear}</span>
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm mt-1">{item.title}</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.skillsUsed.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-end">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  title="Remove sample"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Add Sample Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Work Sample to Portfolio"
      >
        <form onSubmit={handleAdd} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Tarapur MIDC Inventory Tracker"
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Category</label>
              <input
                type="text"
                required
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Client Type</label>
              <input
                type="text"
                required
                value={newClientType}
                onChange={(e) => setNewClientType(e.target.value)}
                placeholder="e.g. Manufacturing MSME"
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Description & Outcome</label>
            <textarea
              rows={3}
              required
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What was built and how did it help the client..."
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Skills Used (Comma-separated)</label>
            <input
              type="text"
              value={newSkills}
              onChange={(e) => setNewSkills(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
            >
              Save to Portfolio
            </button>
          </div>
        </form>
      </Modal>
    </WorkspaceShell>
  );
};
