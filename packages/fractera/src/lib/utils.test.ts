import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatRelativeTime, formatDuration, authBadgeColor, eventTypeColor, eventTypeLabel } from './utils.js';

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  it('formats seconds ago', () => {
    const ts = new Date('2024-01-01T11:59:45Z').toISOString();
    expect(formatRelativeTime(ts)).toBe('15s ago');
  });

  it('formats minutes ago', () => {
    const ts = new Date('2024-01-01T11:55:00Z').toISOString();
    expect(formatRelativeTime(ts)).toBe('5m ago');
  });

  it('formats hours ago', () => {
    const ts = new Date('2024-01-01T09:00:00Z').toISOString();
    expect(formatRelativeTime(ts)).toBe('3h ago');
  });
});

describe('formatDuration', () => {
  it('returns dash for undefined', () => expect(formatDuration()).toBe('—'));
  it('formats ms under a second', () => expect(formatDuration(342)).toBe('342ms'));
  it('formats seconds', () => expect(formatDuration(1500)).toBe('1.5s'));
  it('formats zero', () => expect(formatDuration(0)).toBe('0ms'));
});

describe('authBadgeColor', () => {
  it('returns amber for apiKey', () => expect(authBadgeColor('apiKey')).toBe('#f59e0b'));
  it('returns blue for oauth', () => expect(authBadgeColor('oauth')).toBe('#3b82f6'));
  it('returns purple for bearer', () => expect(authBadgeColor('bearer')).toBe('#8b5cf6'));
  it('returns green for none', () => expect(authBadgeColor('none')).toBe('#22c55e'));
  it('returns green for unknown', () => expect(authBadgeColor('unknown')).toBe('#22c55e'));
});

describe('eventTypeColor', () => {
  it('red for fail events', () => expect(eventTypeColor('TOOL_FAILED')).toBe('#ef4444'));
  it('amber for fallback events', () => expect(eventTypeColor('PROVIDER_FALLBACK')).toBe('#f59e0b'));
  it('green for called events', () => expect(eventTypeColor('TOOL_CALLED')).toBe('#22c55e'));
  it('green for resolved events', () => expect(eventTypeColor('TOOL_RESOLVED')).toBe('#22c55e'));
  it('indigo for other events', () => expect(eventTypeColor('AGENT_STARTED')).toBe('#6366f1'));
});

describe('eventTypeLabel', () => {
  it('converts to lowercase with spaces', () => {
    expect(eventTypeLabel('TOOL_CALLED')).toBe('tool called');
    expect(eventTypeLabel('PROVIDER_FALLBACK')).toBe('provider fallback');
    expect(eventTypeLabel('AGENT_COMPLETED')).toBe('agent completed');
  });
});
