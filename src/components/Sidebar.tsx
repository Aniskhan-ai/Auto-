/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, CodeXml, ShieldCheck, Cpu, CreditCard, Sparkles } from 'lucide-react';
import { AdminConfig } from '../types';

interface SidebarProps {
  activeView: 'dashboard' | 'builder' | 'admin';
  setActiveView: (view: 'dashboard' | 'builder' | 'admin') => void;
  isConnected: boolean;
  activeProjectName?: string;
  adminConfig: AdminConfig | null;
  projectsCount: number;
  onUpgradeClick: () => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  isConnected,
  activeProjectName,
  adminConfig,
  projectsCount,
  onUpgradeClick
}: SidebarProps) {
  const isPremium = adminConfig?.userPlan === 'premium';

  return (
    <aside id="sidebar-panel" className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col justify-between h-screen fixed top-0 left-0 z-40 select-none">
      {/* Upper Logo Container */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="text-black font-serif font-black text-xl italic leading-none flex items-center justify-center">A</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-white flex items-center">
              AUTO <span className="text-[9px] bg-white/10 text-neutral-300 border border-white/10 px-1.5 py-0.5 rounded ml-2 font-mono">V2.0</span>
            </h1>
            <p className="text-[9px] text-[#888888] font-mono tracking-widest uppercase">vibe coding platform</p>
          </div>
        </div>

        {/* Navigation Entries */}
        <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-4">Workspace Navigation</span>
        <nav className="space-y-1.5">
          <button
            id="sidebar-nav-dashboard"
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all text-sm font-medium cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-white/10 text-white border border-white/10 shadow-sm shadow-black/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>Dashboard hub</span>
          </button>

          <button
            id="sidebar-nav-builder"
            onClick={() => setActiveView('builder')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium cursor-pointer ${
              activeView === 'builder'
                ? 'bg-white/10 text-white border border-white/10 shadow-sm shadow-black/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <CodeXml className="w-4.5 h-4.5" />
              <span>Vibe Studio</span>
            </div>
            {activeProjectName && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            id="sidebar-nav-admin"
            onClick={() => setActiveView('admin')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all text-sm font-medium cursor-pointer ${
              activeView === 'admin'
                ? 'bg-white/10 text-white border border-white/10 shadow-sm shadow-black/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>System Console</span>
          </button>
        </nav>
      </div>

      {/* Subscription Tier Card */}
      <div className="px-4 py-2">
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 space-y-2.5">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-neutral-500 font-mono tracking-wider uppercase">LICENSE PLAN</span>
            {isPremium ? (
              <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 font-bold border border-amber-400/20 text-[8px] font-mono tracking-wider uppercase animate-pulse">★ PREMIUM</span>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono font-bold leading-none uppercase">FREE PLAN</span>
            )}
          </div>

          <div className="space-y-1 text-left">
            <div className="flex justify-between items-baseline text-[11px]">
              <span className="text-neutral-300 font-medium">{isPremium ? 'Unlimited access' : '1 Free site limit'}</span>
              <span className="text-[10px] font-mono text-neutral-400">{projectsCount}/1 used</span>
            </div>
            
            {/* Limit Micro-indicator bar */}
            <div className="w-full h-1 bg-black rounded overflow-hidden">
              <div 
                className={`h-full rounded transition-all duration-500 ${isPremium ? 'w-full bg-amber-400' : 'w-full bg-emerald-500'}`}
                style={{ width: isPremium ? '100%' : `${Math.min((projectsCount / 1) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {!isPremium && (
            <button
              onClick={onUpgradeClick}
              className="w-full py-1.5 mt-1 rounded bg-white hover:bg-amber-400 text-black font-bold text-[9px] uppercase font-mono transition-all flex items-center justify-center space-x-1 cursor-pointer shadow"
            >
              <Sparkles className="w-2.5 h-2.5 text-black" />
              <span>Upgrade To Pro</span>
            </button>
          )}
        </div>
      </div>

      {/* Lower Platform Profile */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02] space-y-3">
        {activeProjectName && (
          <div className="p-2.5 bg-neutral-900/40 rounded-lg border border-white/5 text-xs text-left">
            <span className="text-neutral-500 block text-[9px] uppercase font-mono tracking-widest mb-1 leading-none">ACTIVE WORKSPACE</span>
            <span className="font-semibold text-neutral-300 line-clamp-1">{activeProjectName}</span>
          </div>
        )}

        <div className="flex items-center justify-between p-1">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400 opacity-80" />
            <div className="text-left leading-none">
              <span className="text-xs font-semibold text-neutral-300 block">CLAUDE 3.5</span>
              <span className="text-[9px] text-[#666666] font-mono">Core Solver Engine</span>
            </div>
          </div>
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" title="Connected"></span>
        </div>
      </div>
    </aside>
  );
}
