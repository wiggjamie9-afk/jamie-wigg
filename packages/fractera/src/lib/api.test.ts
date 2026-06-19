import { describe, it, expect } from 'vitest';
import { mockRegistry, mockAuditEvents, mockProviderStatus } from './api.js';

describe('mockRegistry', () => {
  it('returns a registry with version', () => {
    const r = mockRegistry();
    expect(r.version).toBe('1.0.0');
  });

  it('has categories and byId', () => {
    const r = mockRegistry();
    expect(Object.keys(r.categories).length).toBeGreaterThan(0);
    expect(Object.keys(r.byId).length).toBeGreaterThan(0);
  });

  it('category counts match tools', () => {
    const r = mockRegistry();
    for (const [, cat] of Object.entries(r.categories)) {
      expect(cat.count).toBe(cat.tools.length);
    }
  });

  it('all byId entries have required fields', () => {
    const r = mockRegistry();
    for (const tool of Object.values(r.byId)) {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.category).toBeTruthy();
      expect(tool.endpoint).toBeTruthy();
      expect(['apiKey', 'oauth', 'bearer', 'none']).toContain(tool.authType);
    }
  });

  it('tools appear in both byId and categories', () => {
    const r = mockRegistry();
    const catToolIds = Object.values(r.categories).flatMap(c => c.tools.map(t => t.id)).sort();
    const byIdKeys = Object.keys(r.byId).sort();
    expect(catToolIds).toEqual(byIdKeys);
  });
});

describe('mockAuditEvents', () => {
  it('returns an array of events', () => {
    const events = mockAuditEvents();
    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  it('all events have required fields', () => {
    for (const e of mockAuditEvents()) {
      expect(e.id).toBeTruthy();
      expect(e.timestamp).toBeTruthy();
      expect(e.type).toBeTruthy();
    }
  });

  it('events are ordered newest first', () => {
    const events = mockAuditEvents();
    for (let i = 1; i < events.length; i++) {
      expect(new Date(events[i - 1].timestamp).getTime()).toBeGreaterThanOrEqual(
        new Date(events[i].timestamp).getTime()
      );
    }
  });
});

describe('mockProviderStatus', () => {
  it('returns 4 providers', () => {
    const p = mockProviderStatus();
    expect(p.length).toBe(4);
  });

  it('includes all expected providers', () => {
    const names = mockProviderStatus().map(p => p.name);
    expect(names).toContain('claude');
    expect(names).toContain('gemini');
    expect(names).toContain('groq');
    expect(names).toContain('openmono');
  });

  it('openmono is offline in mock', () => {
    const openmono = mockProviderStatus().find(p => p.name === 'openmono');
    expect(openmono?.available).toBe(false);
    expect(openmono?.error).toBeTruthy();
  });

  it('cloud providers are available in mock', () => {
    const cloud = mockProviderStatus().filter(p => p.name !== 'openmono');
    for (const p of cloud) {
      expect(p.available).toBe(true);
      expect(p.latency).toBeGreaterThan(0);
    }
  });
});
