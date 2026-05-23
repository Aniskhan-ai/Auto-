/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, AlertCircle, History, Zap, CheckCircle, Flame, Moon, Search, Layers } from 'lucide-react';
import { TelemetryLog } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  telemetry?: TelemetryLog;
}

interface ChatPaneProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  activePresetTitle: string;
  promptHistory: string[];
}

export default function ChatPane({
  onGenerate,
  isLoading,
  activePresetTitle,
  promptHistory
}: ChatPaneProps) {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Vibe Studio fully initialized! Write a natural language prompt to re-code the preview, replace structures, or re-color layers under strict Claude-architect rules.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [activeModel, setActiveModel] = useState('claude-3-5-sonnet');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userMsg,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    setInputText('');
    onGenerate(userMsg);
  };

  const handleActionClick = (prompt: string) => {
    if (isLoading) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: prompt,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    onGenerate(prompt);
  };

  return (
    <div id="chat-pane-root" className="w-full h-full flex flex-col justify-between bg-[#0a0a0a] border-r border-white/5">
      
      {/* Top Console Command Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01] select-none">
        <div className="flex items-center space-x-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#888888]">Vibe Solver Node</span>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <select
            id="chat-model-select"
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-[#050505] border border-white/5 text-[10px] font-mono text-neutral-300 focus:border-white/10 outline-none cursor-pointer"
          >
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="claude-3-5-haiku">Claude 3.5 Haiku</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
          </select>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded bg-[#050505] border border-white/5 text-neutral-400 hover:text-white transition-all hover:border-white/10 cursor-pointer"
            title="Prompt Archive"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* active preset prompt alignment layer bar */}
      <div className="px-4 py-2 bg-white/[0.01] border-b border-white/5 text-[10px] text-neutral-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-3.5 h-3.5 opacity-60" />
          <span>Preset Alignment:</span>
          <span className="font-semibold underline leading-none">{activePresetTitle}</span>
        </div>
        <span className="text-[8px] font-mono uppercase bg-[#1a1a1a] text-neutral-300 px-1.5 py-0.5 rounded border border-white/10">STRICT</span>
      </div>

      {/* Main Conversation Stream */}
      <div id="chat-messages-container" className="flex-1 overflow-y-auto p-4 space-y-4">
        {showHistory && (
          <div id="prompt-history-drawer" className="p-3 bg-[#0c0c0c] rounded-xl border border-white/10 mb-4 animate-fadeIn">
            <span className="text-[9px] font-mono text-[#888888] uppercase tracking-widest block mb-2">PROMPT HISTORY ARCHIVE</span>
            {promptHistory.length === 0 ? (
              <span className="text-xs text-neutral-500 block italic">Archive blank. Compile layouts to register.</span>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {promptHistory.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleActionClick(h);
                      setShowHistory(false);
                    }}
                    className="w-full text-left p-2 rounded bg-[#050505] border border-white/5 hover:border-white/10 text-xs text-neutral-300 hover:text-white transition-all truncate cursor-pointer"
                  >
                    &bull; {h}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1 ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender block tag */}
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest px-1">
              {msg.sender === 'user' ? 'Priority 1 (USER DIRECTIVE)' : 'Auto System Engine'}
            </span>

            <div
              className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-white/10 border border-white/10 text-white rounded-tr-none font-medium text-left'
                  : 'bg-[#0f0f0f] border border-white/5 text-neutral-300 rounded-tl-none font-normal text-left'
              }`}
            >
              {msg.text}

              {/* Display prompt metrics if success telemetry attaches */}
              {msg.telemetry && (
                <div className="mt-2.5 pt-2.5 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-500 text-left">
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-3 h-3 text-white" />
                    <span>Latency: {msg.telemetry.latencyMs}ms</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Compile: SUCCESS</span>
                  </div>
                </div>
              )}
            </div>
            <span className="text-[9px] text-neutral-500 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div id="ai-skeleton-loader" className="space-y-2.5 animate-pulse max-w-[85%]">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block text-left">ENGINE COMPILING LAYOUT METRICS...</span>
            <div className="bg-[#0f0f0f] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="h-3.5 bg-neutral-800 rounded w-full"></div>
              <div className="h-3.5 bg-neutral-800 rounded w-5/6"></div>
              <div className="h-3.5 bg-neutral-800 rounded w-2/3"></div>
            </div>
          </div>
        )}
      </div>

      {/* AI Speed Action Shortcuts Toolbar */}
      <div className="p-3 border-t border-white/5 bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none border-b border-black">
        <button
          onClick={() => handleActionClick('make layout feel premium and elegant with clean borders and better spacings')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#050505] hover:bg-white/5 text-[10px] font-mono text-neutral-300 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
        >
          <Flame className="w-3 h-3" />
          <span>Make Premium ✨</span>
        </button>
        <button
          onClick={() => handleActionClick('translate current workspace design into a beautiful black darkmode theme')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#050505] hover:bg-white/5 text-[10px] font-mono text-neutral-300 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
        >
          <Moon className="w-3 h-3" />
          <span>Dark Mode 🌙</span>
        </button>
        <button
          onClick={() => handleActionClick('improve SEO score introducing descriptive meta elements and semantic HTML structuring')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#050505] hover:bg-white/5 text-[10px] font-mono text-neutral-300 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
        >
          <Search className="w-3 h-3" />
          <span>Improve SEO 📈</span>
        </button>
        <button
          onClick={() => handleActionClick('inject a beautiful interactive accordion frequently asked questions (FAQ) section')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#050505] hover:bg-white/5 text-[10px] font-mono text-neutral-300 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
        >
          <AlertCircle className="w-3 h-3" />
          <span>Inject FAQ 🔍</span>
        </button>
      </div>

      {/* Command Prompter Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#0a0a0a]">
        <div className="flex items-center bg-[#050505] border border-white/5 focus-within:border-white/15 rounded-xl overflow-hidden px-3.5 py-2.5 transition-all">
          <input
            id="chat-prompter-textarea"
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. Add pricing plans / Re-color..."
            className="flex-grow bg-transparent text-xs text-white outline-none placeholder:text-neutral-600"
          />
          <button
            id="btn-send-message"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`p-2 rounded-lg transition-all ${
              inputText.trim() && !isLoading
                ? 'bg-white text-black cursor-pointer hover:bg-neutral-200'
                : 'text-neutral-600 bg-white/5 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2.5 px-1 font-mono text-[9px] text-neutral-500 select-none">
          <span>Targeting index.html file node</span>
          <span>Press Enter to generate</span>
        </div>
      </form>
    </div>
  );
}
