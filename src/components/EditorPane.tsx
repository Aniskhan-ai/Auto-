/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Sliders, Download, ClipboardCheck, Code, FolderOpen, Save } from 'lucide-react';

interface EditorPaneProps {
  project: Project;
  onUpdateProject: (id: string, update: Partial<Project>) => void;
  isLoading: boolean;
}

export default function EditorPane({ project, onUpdateProject, isLoading }: EditorPaneProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [selectedFilePath, setSelectedFilePath] = useState('index.html');
  const [fileContent, setFileContent] = useState('');
  
  // Visual Editor fields
  const [brandTitle, setBrandTitle] = useState('');
  const [brandDesc, setBrandDesc] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#050505');

  // Export properties
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'wordpress' | 'react' | 'nextjs'>('react');
  const [exportedResult, setExportedResult] = useState<{ filename: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mainFile = project.files.find(f => f.path === selectedFilePath);
    if (mainFile) {
      setFileContent(mainFile.content);
    }
    setBrandTitle(project.name);
    setPrimaryColor(project.themeColors?.primary || '#ffffff');
    setBackgroundColor(project.themeColors?.background || '#050505');
  }, [project.id, selectedFilePath, project.version]);

  const handleSaveCode = () => {
    const updatedFiles = project.files.map(f => {
      if (f.path === selectedFilePath) {
        return { ...f, content: fileContent };
      }
      return f;
    });
    onUpdateProject(project.id, { files: updatedFiles });
    alert('Code changes compiled inside live workspace successfully!');
  };

  const handleApplyVisualUpdates = () => {
    let newContent = fileContent;

    newContent = newContent.replace(/<title>[\s\S]*?<\/title>/gi, `<title>${brandTitle}</title>`);
    
    if (project.category === 'saas') {
      newContent = newContent.replace(/AUTOAPI\.io/gi, brandTitle.toUpperCase());
    } else if (project.category === 'ecommerce') {
      newContent = newContent.replace(/GLOWCRAFT/gi, brandTitle.toUpperCase());
    } else if (project.category === 'portfolio') {
      newContent = newContent.replace(/SØRENSEN DESIGN/gi, brandTitle.toUpperCase());
    }

    // Substitute accent and backgrounds
    newContent = newContent.replaceAll('#6366f1', primaryColor).replaceAll('#ec4899', primaryColor);
    newContent = newContent.replaceAll('#090a0f', backgroundColor).replaceAll('#0b0c10', backgroundColor);

    const updatedFiles = project.files.map(f => {
      if (f.path === 'index.html') {
        return { ...f, content: newContent };
      }
      return f;
    });

    onUpdateProject(project.id, {
      name: brandTitle,
      themeColors: {
        primary: primaryColor,
        secondary: primaryColor,
        background: backgroundColor,
        text: project.themeColors?.text || '#f3f4f6'
      },
      files: updatedFiles
    });
    alert('Branding variables registered in workspace coordinates successfully!');
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const typeMap = {
        wordpress: 'wp-theme',
        react: 'react',
        nextjs: 'nextjs'
      };
      
      const res = await fetch(`/api/projects/${project.id}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ format: typeMap[exportFormat] })
      });

      if (res.ok) {
        const payload = await res.json();
        setExportedResult(payload);
      } else {
        alert('Export compilation caught a server exception.');
      }
    } catch (e) {
      console.error(e);
      alert('Network socket missing during export serialization.');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = () => {
    if (!exportedResult) return;
    navigator.clipboard.writeText(exportedResult.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="editor-workspace" className="w-full h-full bg-[#0a0a0a] border-l border-white/5 flex flex-col justify-between">
      
      {/* Tab select bar */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.01] select-none text-xs">
        <div className="flex items-center space-x-1.5 bg-[#050505] p-1.5 rounded-xl border border-white/5">
          <button
            id="tab-toggle-visual"
            onClick={() => setActiveTab('visual')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Visual Variables</span>
          </button>
          <button
            id="tab-toggle-code"
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all font-semibold cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Workspace</span>
          </button>
        </div>

        <span className="text-[9px] font-mono text-neutral-400 border border-white/10 bg-white/5 px-2.5 py-1.5 rounded-lg tracking-wider leading-none uppercase">v{project.version} modules verified</span>
      </div>

      {/* Main Tab Screen Panel content */}
      <div className="flex-grow p-5 overflow-y-auto space-y-6">
        
        {/* TAB 1: VISUAL INSPECTOR (WYSIWYG Variables) */}
        {activeTab === 'visual' && (
          <div id="visual-editor-panel" className="space-y-6">
            <h4 className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Live Brand Variables</h4>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2">Workspace Name Override</label>
                <input
                  type="text"
                  value={brandTitle}
                  onChange={(e) => setBrandTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/5 text-xs text-white focus:border-white/15 outline-none transition-all placeholder:text-neutral-700"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2 font-light">Custom Description Meta</label>
                <textarea
                  value={brandDesc}
                  rows={2}
                  onChange={(e) => setBrandDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/5 text-xs text-white focus:border-white/15 outline-none transition-all resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2">Accent Identity</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded border border-white/5 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-neutral-300">{primaryColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-[#888888] mb-2">Background Node</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded border border-white/5 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-neutral-300">{backgroundColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyVisualUpdates}
              className="w-full py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all font-semibold text-xs uppercase tracking-widest cursor-pointer"
            >
              Apply Variables to Sandbox
            </button>

            {/* Platform Code Exporters Drawer Integration */}
            <div className="p-4 rounded-2xl border border-white/5 bg-[#050505] space-y-4">
              <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">AESTHETIC PACKAGE EXPORTER</span>
              <p className="text-[11px] text-neutral-500 leading-relaxed font-light">Convert this completed interface structure automatically into standard system-ready development components.</p>
              
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-mono text-[10px]">Format Standard:</span>
                  <select
                    value={exportFormat}
                    onChange={(e) => {
                      setExportFormat(e.target.value as any);
                      setExportedResult(null);
                    }}
                    className="px-2.5 py-1.5 bg-[#050505] border border-white/5 text-[10px] font-mono text-neutral-300 rounded focus:border-white/15 outline-none cursor-pointer"
                  >
                    <option value="react">Tailwind React app</option>
                    <option value="nextjs">NextJS Static index</option>
                    <option value="wordpress">WordPress Gutenberg theme</option>
                  </select>
                </div>

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full py-2.5 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all text-[10px] uppercase font-mono shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Packaging Modules...' : 'Generate Theme Output'}</span>
                </button>
              </div>

              {exportedResult && (
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-neutral-500 truncate">{exportedResult.filename}</span>
                    <button
                      onClick={copyToClipboard}
                      className="p-1 rounded bg-[#0a0a0a] hover:bg-white/5 text-neutral-300 hover:text-white transition-all border border-white/5 flex items-center space-x-1 text-[9px] font-mono cursor-pointer"
                    >
                      <ClipboardCheck className="w-3 h-3" />
                      <span>{copied ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="text-[9.5px] font-mono text-emerald-400 max-h-40 overflow-y-auto bg-black p-2.5 rounded-xl border border-white/5 leading-relaxed scrollbar-none text-left select-text">
                    {exportedResult.content.trim()}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CODE EDITOR & WORKSPACE */}
        {activeTab === 'code' && (
          <div id="code-editor-panel" className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="w-4 h-4 text-white opacity-80" />
                  <span className="text-xs font-mono text-neutral-400">File Directory:</span>
                  <span className="text-xs font-bold text-white font-mono italic bg-black px-2 py-0.5 rounded border border-white/5">/{selectedFilePath}</span>
                </div>
              </div>

              {/* Code Viewing Area */}
              <div className="relative rounded-2xl border border-white/5 bg-[#050505] overflow-hidden">
                <div className="px-4 py-2 bg-black border-b border-white/5 flex items-center justify-between select-none">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10"></span>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-[#888888]">MANUAL OVERRIDES</span>
                </div>
                <textarea
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  rows={20}
                  className="w-full p-4 bg-transparent text-xs font-mono text-emerald-450/95 leading-relaxed outline-none resize-none focus:ring-0 select-text"
                  spellCheck={false}
                />
              </div>
            </div>

            <button
              onClick={handleSaveCode}
              className="w-full py-3.5 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all text-xs uppercase tracking-widest flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Custom Code Edits</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
