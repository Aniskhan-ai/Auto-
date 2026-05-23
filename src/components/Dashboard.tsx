/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, AdminConfig } from '../types';
import { Plus, FolderPlus, ArrowRight, Layers, Sparkles, ShoppingBag, Landmark, BookOpen, Trash2, Award } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  activeProject: Project | null;
  selectProject: (p: Project) => void;
  createProject: (name: string, category: string, description: string) => void;
  deleteProject: (id: string) => void;
  adminConfig: AdminConfig | null;
  onUpgradeClick: () => void;
}

export default function Dashboard({
  projects,
  activeProject,
  selectProject,
  createProject,
  deleteProject,
  adminConfig,
  onUpgradeClick
}: DashboardProps) {
  const [showCreator, setShowCreator] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCat, setProjCat] = useState('saas');

  const categories = [
    { id: 'saas', name: 'SaaS Platform Landing Page', icon: Sparkles, color: 'text-white bg-white/5 border-white/10', desc: 'High-converting layout with stats, mock codes lists, and pricing tables.' },
    { id: 'ecommerce', name: 'WooCommerce / Shopify Skincare Shop', icon: ShoppingBag, color: 'text-white bg-white/5 border-white/10', desc: 'Sleek dark grid featuring organic serum items, active review cards, and checkouts.' },
    { id: 'portfolio', name: 'Minimalist Architecture Portfolio', icon: Landmark, color: 'text-white bg-white/5 border-white/10', desc: 'Ultra-thin spatial concrete layout with clean lines, editorial negative spaces.' },
    { id: 'blog', name: 'Editorial Newspaper Layout', icon: BookOpen, color: 'text-white bg-white/5 border-white/10', desc: 'Focus on high contrast readability, multi-section columns, and minimal articles.' }
  ];

  const handleSpawn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const customProjects = projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3');
    if (adminConfig?.userPlan === 'free' && customProjects.length >= 1) {
      onUpgradeClick();
      return;
    }

    createProject(projName, projCat, projDesc);
    setProjName('');
    setProjDesc('');
    setShowCreator(false);
  };

  return (
    <div id="dashboard-container" className="p-8 max-w-7xl mx-auto space-y-12 animate-fadeIn text-left">
      {/* Header banner */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-serif text-white italic tracking-tight font-light">Active Workspaces Hub</h2>
          <p className="text-sm text-neutral-400 mt-1">Deploy production-ready websites, ecommerce WooCommerce store interfaces, and custom portfolios instantly.</p>
        </div>
        <button
          id="btn-trigger-creator"
          onClick={() => {
            const customProjects = projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3');
            if (adminConfig?.userPlan === 'free' && customProjects.length >= 1) {
              onUpgradeClick();
            } else {
              setShowCreator(!showCreator);
            }
          }}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-all shadow-md text-sm cursor-pointer"
        >
          <FolderPlus className="w-4.5 h-4.5" />
          <span>Spawn Project</span>
        </button>
      </header>

      {/* Spanning Modal Drawer */}
      {showCreator && (
        <div id="creator-drawer" className="p-6 rounded-2xl border border-white/10 bg-[#0c0c0c] relative max-w-xl animate-fadeIn shadow-2xl shadow-black/80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-serif italic text-white font-light flex items-center">
              <Plus className="w-5 h-5 text-neutral-300 mr-2" />
              Configure New Workspace
            </h3>
            <button onClick={() => setShowCreator(false)} className="text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer">Dismiss</button>
          </div>

          <form onSubmit={handleSpawn} className="space-y-5">
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2">Platform / Brand Name</label>
              <input
                type="text"
                required
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder="e.g. SkinCare Aura, CryptoTrade.io"
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/5 text-sm text-white focus:border-white/20 outline-none transition-all placeholder:text-neutral-600"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2 font-light">Project Brief Description</label>
              <input
                type="text"
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder="e.g. Elegant product store displaying natural lotions and active retinol serums."
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/5 text-sm text-white focus:border-white/20 outline-none transition-all placeholder:text-neutral-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setProjCat(cat.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      projCat === cat.id
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'bg-[#050505] border-white/5 text-neutral-400 hover:border-white/10 hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-3" />
                    <div>
                      <span className="text-xs font-bold block">{cat.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all text-xs uppercase tracking-widest cursor-pointer"
            >
              Deploy Selected Template
            </button>
          </form>
        </div>
      )}

      {/* Main Grid: Projects + Sub monetization statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Active Projects List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-serif italic text-white font-light flex items-center col-span-2">
              <Layers className="w-4.5 h-4.5 text-neutral-450 mr-2.5" />
              Active Workspace Modules
            </h3>
            <span className="text-xs text-neutral-500 font-mono italic">{projects.length} loaded</span>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-white/5 bg-[#0c0c0c]/40">
              <Layers className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
              <h4 className="text-md font-semibold text-neutral-400">No active workspaces detected</h4>
              <p className="text-xs text-neutral-500 mt-1 mb-6">Create or select an aesthetic local template source to begin compiling.</p>
              <button
                onClick={() => {
                  const customProjects = projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3');
                  if (adminConfig?.userPlan === 'free' && customProjects.length >= 1) {
                    onUpgradeClick();
                  } else {
                    setShowCreator(true);
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
              >
                Spawn New Container
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`p-5 rounded-2xl border transition-all flex justify-between items-center group cursor-pointer ${
                    activeProject?.id === proj.id
                      ? 'bg-white/[0.04] border-white/20 shadow-md shadow-black/40'
                      : 'bg-[#0c0c0c] border-white/5 hover:border-white/10'
                  }`}
                  onClick={() => selectProject(proj)}
                >
                  <div className="space-y-2 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <span className="text-md font-bold text-white">{proj.name}</span>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10 text-[9px] font-mono">v{proj.version}</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 text-[9px] font-mono tracking-wider uppercase">{proj.category}</span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-1 leading-relaxed">{proj.description}</p>
                    <div className="text-[10px] text-neutral-505 font-mono">
                      Last compiled: {new Date(proj.updatedAt).toLocaleDateString()} at {new Date(proj.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(proj.id);
                      }}
                      className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all cursor-pointer"
                      title="Wipe module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monetization / Metrics Sidebar Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-[#0c0c0c] p-6 shadow-xl relative overflow-hidden">
            {/* Background design glow */}
            <div className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl transition-all ${adminConfig?.userPlan === 'premium' ? 'bg-amber-400/10' : 'bg-emerald-400/5'}`}></div>

            <div className="mb-5 text-left">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-semibold block mb-1">PRO ACCOUNT STATE</span>
              <h4 className="text-lg font-serif italic text-white font-light">Workspace Deploy Limits</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Active Tier license</span>
                  <span className={`font-bold uppercase tracking-wider ${adminConfig?.userPlan === 'premium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {adminConfig?.userPlan === 'premium' ? 'Premium Lifetime Plan' : 'Free Sandbox Tier'}
                  </span>
                </div>
                {/* Custom styling metric bar */}
                <div className="w-full h-1.5 rounded bg-[#050505] overflow-hidden">
                  <div 
                    className={`h-full rounded transition-all duration-500 ${adminConfig?.userPlan === 'premium' ? 'bg-amber-400 w-full' : 'bg-emerald-400'}`} 
                    style={{ width: adminConfig?.userPlan === 'premium' ? '100%' : `${Math.min((projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3').length / 1) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                  <span>{projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3').length} Workspace{projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3').length !== 1 ? 's' : ''} Active</span>
                  <span>{adminConfig?.userPlan === 'premium' ? 'Unlimited Credits' : '1 Free Credit limit'}</span>
                </div>
              </div>

              {adminConfig?.userPlan === 'premium' ? (
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10 text-xs text-neutral-300 leading-relaxed mb-4 text-left">
                  ✦ **Premium Active**: You have fully unlocked unlimited workspace deployments, dual prompt generation rules, and static WooCommerce and Gutenberg formatting exporters!
                </div>
              ) : (
                <div className="p-4 bg-white/[0.01] rounded-xl border border-white/5 text-xs text-neutral-400 leading-relaxed mb-4 text-left">
                  💡 You are currently on the **Free Sandbox**. Upgrading to **Lifetime Premium Pro ($19)** unlocks unlimited workspace modules, custom styling layouts, production outputs, and high capacity AI generators.
                </div>
              )}

              {adminConfig?.userPlan === 'premium' ? (
                <div className="flex items-center justify-center space-x-2 py-3 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold text-xs uppercase tracking-widest leading-none">
                  <Award className="w-4.5 h-4.5" />
                  <span>Licensed Active ✦</span>
                </div>
              ) : (
                <button
                  onClick={onUpgradeClick}
                  className="w-full py-3 rounded-full bg-white text-black font-bold transition-all text-xs uppercase tracking-widest shadow-xl cursor-pointer flex items-center justify-center space-x-1.5 hover:bg-neutral-200"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Upgrade to Premium Pro</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick template starter kits grid */}
          <div className="space-y-4">
            <h4 className="text-[9px] font-mono uppercase text-neutral-550 tracking-widest">Seed Kits Available</h4>
            <div className="space-y-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      const customProjectsCount = projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3').length;
                      if (adminConfig?.userPlan !== 'premium' && customProjectsCount >= 1) {
                        onUpgradeClick();
                        return;
                      }
                      setProjCat(cat.id);
                      setProjName(`My ${cat.name.replace('Template', '').replace('Page', '').trim()}`);
                      setShowCreator(true);
                      document.getElementById('btn-trigger-creator')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-4 rounded-xl border border-white/5 bg-[#0c0c0c]/40 hover:border-white/10 hover:bg-white/[0.02] transition-all flex items-start space-x-3.5 cursor-pointer group"
                  >
                    <div className={`p-2 rounded-lg border ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-white transition-colors">{cat.name}</h5>
                      <p className="text-[11px] text-[#666666] mt-0.5 leading-relaxed font-light">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
