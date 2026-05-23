/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Tablet, Smartphone, RotateCw, ExternalLink, Globe2, Loader2 } from 'lucide-react';
import { Project } from '../types';

interface PreviewPaneProps {
  project: Project;
  isLoading: boolean;
}

export default function PreviewPane({ project, isLoading }: PreviewPaneProps) {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeUrl, setIframeUrl] = useState('');
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    // Append a cache-bypassing timestamp query tag
    const stamp = Date.now();
    setIframeUrl(`/api/projects/${project.id}/preview?v=${stamp}`);
    setIsIframeLoading(true);
  }, [project.id, project.version]);

  const handleManualRefresh = () => {
    const stamp = Date.now();
    setIframeUrl(`/api/projects/${project.id}/preview?v=${stamp}`);
    setIsIframeLoading(true);
  };

  const viewportWidthClass = {
    desktop: 'w-full h-full max-w-full',
    tablet: 'w-[768px] h-[95%] border-x-8 border-neutral-900 rounded-3xl',
    mobile: 'w-[375px] h-[85%] border-x-8 border-neutral-900 rounded-3xl'
  };

  return (
    <div id="preview-pane-root" className="w-full h-full bg-[#050505] flex flex-col justify-between">
      
      {/* Top Device Actions and Controls Selector */}
      <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a] flex items-center justify-between select-none">
        <div className="flex items-center space-x-2.5">
          <Globe2 className="w-4.5 h-4.5 text-neutral-400" />
          <span className="text-xs font-semibold text-white">Interactive Compiled Output Viewport</span>
        </div>

        {/* Viewport Scale Toggles */}
        <div className="flex items-center space-x-1.5 bg-[#050505] p-1.5 rounded-xl border border-white/5">
          <button
            id="viewport-desktop-toggle"
            onClick={() => setViewportMode('desktop')}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewportMode === 'desktop'
                ? 'bg-white/10 text-white border border-white/5'
                : 'text-neutral-500 hover:text-white'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            id="viewport-tablet-toggle"
            onClick={() => setViewportMode('tablet')}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-white/10 text-white border border-white/5'
                : 'text-neutral-500 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            id="viewport-mobile-toggle"
            onClick={() => setViewportMode('mobile')}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-white/10 text-white border border-white/5'
                : 'text-neutral-500 hover:text-white'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sandbox Action options */}
        <div className="flex items-center space-x-2 text-right">
          <button
            onClick={handleManualRefresh}
            className="p-2.5 rounded-xl bg-[#050505] border border-white/5 hover:border-white/10 hover:text-white text-neutral-400 transition-all flex items-center cursor-pointer"
            title="Reload frame"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <a
            href={`/api/projects/${project.id}/preview`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-[#050505] border border-white/5 hover:border-white/10 hover:text-white text-neutral-400 transition-all flex items-center cursor-pointer"
            title="Open frame sandbox page safely in a new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Mock browser address line details */}
      <div className="px-6 py-2 bg-[#0a0a0a] border-b border-light-dark flex items-center justify-between pointer-events-none select-none">
        <div className="flex-grow max-w-xl mx-auto rounded-lg bg-[#050505] px-4 py-1.5 border border-white/5 flex items-center justify-between text-[10px] font-mono whitespace-nowrap text-neutral-500 overflow-hidden">
          <span className="text-white bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold leading-none uppercase mr-1">SANDBOX</span>
          <span className="flex-grow truncate pl-2">https://auto.platforms.run/preview/{project.id}/index.html</span>
          {isIframeLoading || isLoading ? (
            <Loader2 className="w-3.5 h-3.5 text-white animate-spin ml-2" />
          ) : (
            <span className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded leading-none text-[8px] font-mono tracking-wider ml-2 uppercase">&bull; active compiler online</span>
          )}
        </div>
      </div>

      {/* Viewport Frame Box Inner Sandbox Container */}
      <div className="flex-grow flex items-center justify-center p-4 overflow-hidden relative bg-[#050505]">
        {/* Absolute loader helper */}
        {(isLoading || isIframeLoading) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="bg-[#0a0a0a] border border-white/15 p-5 rounded-2xl flex items-center space-x-4 shadow-2xl">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
              <div className="text-xs text-left">
                <p className="font-bold text-white">Rebuilding active page node</p>
                <p className="text-neutral-500 text-[10px] uppercase font-mono mt-0.5 tracking-widest">Syncing style vectors</p>
              </div>
            </div>
          </div>
        )}

        <div className={`bg-white transition-all shadow-2xl relative ${viewportWidthClass[viewportMode]}`}>
          {iframeUrl && (
            <iframe
              id="live-applet-sandbox-iframe"
              ref={iframeRef}
              src={iframeUrl}
              onLoad={() => setIsIframeLoading(false)}
              className="w-full h-full border-0 bg-white"
              title={`${project.name} Live Environment`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
