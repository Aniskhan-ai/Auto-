/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AdminConfig, SystemPromptPreset, TelemetryLog } from '../types';
import { Sliders, ToggleLeft, ToggleRight, Save, Key, BarChart3, RotateCw, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  config: AdminConfig;
  onUpdateConfig: (updated: Partial<AdminConfig>) => void;
  logs: TelemetryLog[];
  onRefreshLogs: () => void;
}

export default function AdminPanel({
  config,
  onUpdateConfig,
  logs,
  onRefreshLogs
}: AdminPanelProps) {
  const [apiKey, setApiKey] = useState(config.claudeApiKey || '');
  const [temp, setTemp] = useState(config.temperature);
  const [maxTokens, setMaxTokens] = useState(config.maxTokens);
  const [activePresetId, setActivePresetId] = useState(config.activePromptPresetId);
  const [presets, setPresets] = useState<SystemPromptPreset[]>(config.systemPrompts || []);
  
  // Custom prompt entry states
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');

  const handleSaveParameters = () => {
    onUpdateConfig({
      claudeApiKey: apiKey,
      temperature: temp,
      maxTokens: maxTokens,
      activePromptPresetId: activePresetId,
      systemPrompts: presets
    });
    alert('Global platform parameters updated in disk successfully!');
  };

  const handleTogglePreset = (id: string) => {
    const updated = presets.map(p => {
      if (p.id === id) {
        return { ...p, enabled: !p.enabled };
      }
      return p;
    });
    setPresets(updated);
  };

  const handleAddCustomPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customText) return;

    const newPr: SystemPromptPreset = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      promptText: customText,
      enabled: true,
      isCustom: true
    };

    const updated = [...presets, newPr];
    setPresets(updated);
    setCustomTitle('');
    setCustomText('');
    alert('Custom background prompt layer registered!');
  };

  const handleRemoveCustomPreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
  };

  return (
    <div id="admin-panel-root" className="p-8 max-w-7xl mx-auto space-y-12 text-left animate-fadeIn">
      <header className="border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white italic tracking-tight font-light">System Console & Admin Panel</h2>
          <p className="text-sm text-neutral-400 mt-1">Configure Claude key bindings, background optimization priorities, templates matching weights, and live latency streams.</p>
        </div>
        <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 tracking-wider">
          SECURE &bull; ROOT ACCESS GRANTED
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Row 1: System prompt layering manager */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Preset Layers List */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#0c0c0c] space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-md font-bold text-white flex items-center">
                <Sliders className="w-4.5 h-4.5 text-neutral-400 mr-2.5" />
                Double System Prompt Preset Layers (Priority 2 Background Rules)
              </h3>
            </div>

            <div className="space-y-4">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className={`p-5 rounded-xl border transition-all space-y-3 ${
                    preset.enabled
                      ? 'bg-white/[0.04] border-white/20'
                      : 'bg-[#050505] border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xs font-bold text-white leading-none">{preset.title}</span>
                        {preset.id === activePresetId && (
                          <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono text-[8px] border border-white/10">CURRENT ACTIVE ACCENT</span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 font-mono leading-relaxed">{preset.promptText}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTogglePreset(preset.id)}
                        className="p-1 rounded bg-[#050505] border border-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer"
                        title={preset.enabled ? 'Disable Layer' : 'Enable Layer'}
                      >
                        {preset.enabled ? (
                          <ToggleRight className="w-7 h-7 text-white" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-neutral-600" />
                        )}
                      </button>

                      {preset.isCustom && (
                        <button
                          onClick={() => handleRemoveCustomPreset(preset.id)}
                          className="p-2 bg-red-500/10 border border-red-500/15 text-red-400 hover:bg-red-500 hover:text-white rounded transition-all cursor-pointer"
                          title="Wipe custom layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3 text-[10px] text-neutral-500 font-mono">
                    <button
                      onClick={() => {
                        setActivePresetId(preset.id);
                        onUpdateConfig({ activePromptPresetId: preset.id });
                      }}
                      className="hover:text-white underline transition-colors cursor-pointer"
                    >
                      Use as Active Alignment Core
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Background Prompt spawned form */}
            <form onSubmit={handleAddCustomPreset} className="p-4 rounded-xl border border-white/5 bg-black/40 space-y-4">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">SPAWN CUSTOM SYSTEM ALIGNMENT LAYER</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Layer Title (e.g. Elegant Fonts)"
                  className="md:col-span-1 px-4 py-2.5 bg-[#050505] border border-white/5 rounded-xl text-xs text-white focus:border-white/15 outline-none font-sans"
                />
                <input
                  type="text"
                  required
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Priority 2 Guidelines Prompt Instruction..."
                  className="md:col-span-2 px-4 py-2.5 bg-[#050505] border border-white/5 rounded-xl text-xs text-white focus:border-white/15 outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-white text-black font-bold text-[10px] uppercase font-mono shadow-md cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                Insert Layer
              </button>
            </form>
          </div>

          {/* Telemetry log list */}
          <div className="p-6 rounded-2xl border border-white/5 bg-[#0c0c0c] space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-md font-bold text-white flex items-center">
                <BarChart3 className="w-4.5 h-4.5 text-neutral-450 mr-2.5" />
                Live Telemetry & Logs Monitor Stream
              </h3>
              <button
                onClick={onRefreshLogs}
                className="p-2 rounded bg-[#050505] border border-white/5 text-neutral-400 hover:text-white hover:bg-white/5 transition-all flex items-center cursor-pointer"
                title="Force refresh metrics"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-black/40 border border-white/5 flex justify-between items-center font-mono text-[10.5px]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                       <span className="font-bold text-neutral-205">{log.action}</span>
                    </div>
                    <p className="text-[9.5px] text-neutral-500">Module: {log.modelName} &bull; Latency: {log.latencyMs}ms</p>
                  </div>

                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10 text-[9px]">
                      ~{log.tokensUsed} generated tokens
                    </span>
                    <span className="block text-[9px] text-[#666666] mt-1">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Global Config Details */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-[#0c0c0c] space-y-5">
            <div className="mb-4">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-semibold block mb-1">CLAUDE AI CONNECTIVES</span>
              <h3 className="text-md font-serif italic text-white font-light">Sdk Parameters</h3>
            </div>

            <div className="space-y-5 text-left">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2">Claude Operator Secret API Key</label>
                <div className="relative flex items-center">
                  <Key className="absolute left-3.5 w-4 h-4 text-[#666666]" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-white/5 rounded-xl text-xs text-white focus:border-white/15 outline-none transition-all placeholder:text-neutral-700 font-sans"
                  />
                </div>
                <span className="text-[9.5px] text-neutral-500 leading-relaxed max-w-sm block mt-1.5">When blank, Auto triggers its Vibe Code Offline Solver. Supply key sk-ant-... to trigger real Claude calls.</span>
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2">Temperature level ({temp})</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-neutral-500 mt-1">
                  <span>Sober (0.1)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2">Max generated tokens ({maxTokens})</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4000)}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-white/5 rounded-xl text-xs text-white focus:border-white/15 outline-none font-sans"
                />
              </div>

              <button
                onClick={handleSaveParameters}
                className="w-full py-3 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all text-xs uppercase tracking-widest flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Parameters</span>
              </button>
            </div>
          </div>

          {/* Slices representation details box */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 space-y-3.5">
            <h4 className="text-[10px] font-mono uppercase text-neutral-500 max-w-min block whitespace-nowrap tracking-wider">Template Directory Health</h4>
            <div className="space-y-2 text-xs text-neutral-400 leading-none">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Total Local Seed Themes</span>
                <span className="font-bold text-white">4 instances</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Active project instances</span>
                <span className="font-bold text-white">3 active</span>
              </div>
              <div className="flex justify-between py-1 pb-0">
                <span>Wasm Webpack Index status</span>
                <span className="text-emerald-400 font-mono tracking-wide text-[10px] font-bold">READY 🟢</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
