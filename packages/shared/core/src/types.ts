// Core type definitions shared across all domains

export interface ProjectConfig {
  name: string;
  domain: DomainType;
  version: string;
  description?: string;
}

export type DomainType = 'web' | 'backend' | 'data' | 'ai' | 'mobile' | 'desktop' | 'cli' | 'infrastructure';

export interface BuildContext {
  domain: DomainType;
  projectName: string;
  outDir: string;
  isDev: boolean;
  env: Record<string, string>;
}

export interface TaskResult {
  success: boolean;
  message: string;
  duration?: number;
  error?: Error;
}

export interface Project {
  id: string;
  name: string;
  domain: DomainType;
  path: string;
  config: ProjectConfig;
}
