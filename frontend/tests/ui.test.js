import { describe, expect, it } from 'vitest';
import {
  buildSparkline,
  createInitialState,
  createWidgetPayload,
  escapeHtml,
  getActiveSnapshot,
  getChangeDirection,
  getFilteredMetrics,
  setActiveTimeframe,
  toggleFavorite
} from '../dashboard.js';

describe('dashboard utilities', () => {
  it('escapes html content safely', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('detects change direction', () => {
    expect(getChangeDirection('-12%')).toBe('down');
    expect(getChangeDirection('+5%')).toBe('up');
    expect(getChangeDirection('')).toBe('up');
  });

  it('builds sparkline svg markup', () => {
    const svg = buildSparkline([1, 3, 2, 5], 'test');
    expect(svg).toContain('gradient-test');
    expect(svg).toContain('<svg');
  });

  it('creates state with default snapshot', () => {
    const state = createInitialState();
    expect(state.timeframe).toBe('30d');
    const snapshot = getActiveSnapshot(state);
    expect(Array.isArray(snapshot.metrics)).toBe(true);
    expect(snapshot.metrics.length).toBeGreaterThan(0);
  });

  it('toggles favorite metrics', () => {
    const state = createInitialState();
    toggleFavorite(state, 'arr');
    expect(state.favoriteMetricIds.includes('arr')).toBe(true);
    const countAfterAdd = state.favoriteMetricIds.length;
    toggleFavorite(state, 'arr');
    expect(state.favoriteMetricIds.includes('arr')).toBe(false);
    expect(state.favoriteMetricIds.length).toBeLessThanOrEqual(countAfterAdd);
  });

  it('sets timeframe when valid', () => {
    const state = createInitialState();
    const changed = setActiveTimeframe(state, '7d');
    expect(changed).toBe(true);
    expect(state.timeframe).toBe('7d');
    const unchanged = setActiveTimeframe(state, '7d');
    expect(unchanged).toBe(false);
    const invalid = setActiveTimeframe(state, '1y');
    expect(invalid).toBe(false);
  });

  it('filters metrics by category', () => {
    const state = createInitialState();
    const snapshot = getActiveSnapshot(state);
    const revenueMetrics = getFilteredMetrics(snapshot.metrics, 'Revenue');
    expect(revenueMetrics.every((metric) => metric.category === 'Revenue')).toBe(true);
  });

  it('creates widget payload with sanitization', () => {
    const widget = createWidgetPayload({
      title: 'Growth <Velocity>',
      value: '$123K',
      change: '+12% vs plan',
      category: 'Revenue',
      note: 'Focus on <expansion>'
    });
    expect(widget.title).toBe('Growth &lt;Velocity&gt;');
    expect(widget.note).toContain('&lt;');
    expect(() => createWidgetPayload({ title: '', value: '' })).toThrow();
  });
});
