/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project, AdminConfig, TelemetryLog } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatPane from './components/ChatPane';
import PreviewPane from './components/PreviewPane';
import EditorPane from './components/EditorPane';
import AdminPanel from './components/AdminPanel';
import UpgradeModal from './components/UpgradeModal';
import { LayoutDashboard, Sparkles, CodeXml, ShieldCheck, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'builder' | 'admin'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [adminConfig, setAdminConfig] = useState<AdminConfig | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // --- API OPERATIONS ---

  useEffect(() => {
    fetchProjects();
    fetchAdminConfig();
    fetchLogs();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        if (data.length > 0 && !activeProject) {
          setActiveProject(data[0]);
        }
      }
    } catch (e) {
      console.error('Projects sync failed:', e);
    }
  };

  const fetchAdminConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const data = await res.json();
        setAdminConfig(data);
      }
    } catch (e) {
      console.error('Credentials loading failed:', e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs');
      if (res.ok) {
        const data = await res.json();
        setTelemetryLogs(data);
      }
    } catch (e) {
      console.error('Telemetry tracking failed:', e);
    }
  };

  const handleCreateProject = async (name: string, category: string, description: string) => {
    const customProjects = projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3');
    if (adminConfig?.userPlan === 'free' && customProjects.length >= 1) {
      setShowUpgradeModal(true);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, description })
      });

      if (res.status === 402) {
        setShowUpgradeModal(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [...prev, data]);
        setActiveProject(data);
        setActiveView('builder'); // Instantly open in Vibe Studio studio
      }
    } catch (e) {
      console.error(e);
      alert('Workspace initialization encountered an issue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (id: string, update: Partial<Project>) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
        setActiveProject(data);
      }
    } catch (e) {
      console.error(e);
      alert('Internal save process halted.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you certain you wish to permanently erase this project workspace?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (activeProject?.id === id) {
          setActiveProject(null);
        }
        alert('Workspace module completely wiped!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateCode = async (prompt: string) => {
    if (!activeProject) return;
    setIsLoading(true);

    setPromptHistory((prev) => [prompt, ...prev.filter((p) => p !== prompt)].slice(0, 10));

    try {
      const res = await fetch(`/api/projects/${activeProject.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === activeProject.id ? data.project : p)));
        setActiveProject(data.project);
        setTelemetryLogs((prev) => [data.telemetry, ...prev]);
      } else {
        alert('Failed compiling AI updates. Check console parameters.');
      }
    } catch (e) {
      console.error(e);
      alert('Network timeout while compiling AI layout models.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConfig = async (newConfig: Partial<AdminConfig>) => {
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });

      if (res.ok) {
        fetchAdminConfig();
        fetchLogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activePresetTitle = adminConfig?.systemPrompts?.find(
    (p) => p.id === adminConfig.activePromptPresetId
  )?.title || 'Standard Geometric Swiss Alignment';

  return (
    <div id="app-root-workspace" className="min-h-screen bg-[#050505] text-[#b3b3b3] flex font-sans antialiased text-left select-text">
      
      {/* Platform Left Navigation Side rails */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isConnected={true}
        activeProjectName={activeProject?.name}
        adminConfig={adminConfig}
        projectsCount={projects.filter(p => p.id !== 'proj-1' && p.id !== 'proj-2' && p.id !== 'proj-3').length}
        onUpgradeClick={() => setShowUpgradeModal(true)}
      />

      {/* Main Panel views layout */}
      <main id="app-main-viewport" className="pl-64 flex-1 min-h-screen flex flex-col justify-between">
        
        {/* VIEW 1: PROJECTS HUB PORTAL */}
        {activeView === 'dashboard' && (
          <Dashboard
            projects={projects}
            activeProject={activeProject}
            selectProject={(p) => {
              setActiveProject(p);
              setActiveView('builder');
            }}
            createProject={handleCreateProject}
            deleteProject={handleDeleteProject}
            adminConfig={adminConfig}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        )}

        {/* VIEW 2: SPLIT SCREEN INTERACTIVE MULTI-PANE BUILDER */}
        {activeView === 'builder' && (
          <div id="vibe-builder-studio" className="w-full h-screen grid grid-cols-12 overflow-hidden bg-transparent">
            {/* L-Col: Conversions, Actions & Conversational Agent */}
            <div className="col-span-3 h-full border-r border-white/5">
              <ChatPane
                onGenerate={handleGenerateCode}
                isLoading={isLoading}
                activePresetTitle={activePresetTitle}
                promptHistory={promptHistory}
              />
            </div>

            {/* M-Col: Compiled page live interactive Frame Sandbox */}
            <div className="col-span-6 h-full flex flex-col">
              {activeProject ? (
                <PreviewPane
                  project={activeProject}
                  isLoading={isLoading}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#070707]">
                  <HelpCircle className="w-12 h-12 text-neutral-400 mb-4 animate-bounce" />
                  <h4 className="text-md font-bold text-white">No active sandbox mounted</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">Go to the **Dashboard hub** and select or spawn an aesthetic starting template to load files.</p>
                </div>
              )}
            </div>

            {/* R-Col: Visual parameter variables customizer & Source text editor */}
            <div className="col-span-3 h-full border-l border-white/5">
              {activeProject ? (
                <EditorPane
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                  isLoading={isLoading}
                />
              ) : (
                <div className="h-full bg-[#070707] p-8 flex items-center justify-center text-xs text-neutral-600 italic">
                  Parameters panel inactive.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: SYSTEM CONSOLE (API CREDENTIALS, LOGS, METRICS, PRESETS) */}
        {activeView === 'admin' && adminConfig && (
          <AdminPanel
            config={adminConfig}
            onUpdateConfig={handleUpdateConfig}
            logs={telemetryLogs}
            onRefreshLogs={fetchLogs}
          />
        )}

        {showUpgradeModal && (
          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            onUpgradeSuccess={(newPlan) => {
              fetchAdminConfig();
              fetchLogs();
              fetchProjects();
            }}
          />
        )}
      </main>
    </div>
  );
}
