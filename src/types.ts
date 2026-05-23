/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectFile {
  path: string;
  content: string;
  type: 'html' | 'css' | 'js' | 'json' | 'md';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  files: ProjectFile[];
  themeColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface SystemPromptPreset {
  id: string;
  title: string;
  promptText: string;
  enabled: boolean;
  isCustom?: boolean;
}

export interface TelemetryLog {
  id: string;
  action: string;
  timestamp: string;
  tokensUsed: number;
  modelName: string;
  latencyMs: number;
  status: 'success' | 'failed';
}

export interface AdminConfig {
  claudeApiKey: string;
  temperature: number;
  maxTokens: number;
  activePromptPresetId: string;
  localLibraryIndexed: boolean;
  systemPrompts?: SystemPromptPreset[];
  userPlan?: 'free' | 'premium';
}

export interface UserSubscription {
  plan: 'free' | 'premium' | 'pro';
  status: 'active' | 'trialing' | 'canceled';
  currentPeriodEnd: string;
  usageCount: number;
  usageLimit: number;
}
