export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  if (diff < 60_000) return `${Math.round(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)}h ago`;
  return new Date(isoString).toLocaleDateString();
}

export function formatDuration(ms?: number): string {
  if (ms === undefined) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function authBadgeColor(authType: string): string {
  switch (authType) {
    case 'apiKey': return '#f59e0b';
    case 'oauth': return '#3b82f6';
    case 'bearer': return '#8b5cf6';
    default: return '#22c55e';
  }
}

export function eventTypeColor(type: string): string {
  if (type.includes('FAIL')) return '#ef4444';
  if (type.includes('FALLBACK')) return '#f59e0b';
  if (type.includes('CALLED') || type.includes('RESOLVED')) return '#22c55e';
  return '#6366f1';
}

export function eventTypeLabel(type: string): string {
  return type.toLowerCase().replace(/_/g, ' ');
}
