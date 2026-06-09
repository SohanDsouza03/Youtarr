import { alpha } from '../useTheme';

describe('alpha', () => {
  test('applies opacity to a hsl(var(--token)) color using the HSL channel trick', () => {
    expect(alpha('hsl(var(--primary))', 0.5)).toBe('hsl(var(--primary) / 0.5)');
  });

  test('supports fully opaque values', () => {
    expect(alpha('hsl(var(--destructive))', 1)).toBe('hsl(var(--destructive) / 1)');
  });

  test('supports fully transparent values', () => {
    expect(alpha('hsl(var(--success))', 0)).toBe('hsl(var(--success) / 0)');
  });

  test('returns non-CSS-var colors unchanged (best-effort fallback)', () => {
    expect(alpha('#ff0000', 0.5)).toBe('#ff0000');
    expect(alpha('rgb(255, 0, 0)', 0.5)).toBe('rgb(255, 0, 0)');
  });

  test('does not treat a plain hsl() color as a CSS variable', () => {
    expect(alpha('hsl(0, 100%, 50%)', 0.5)).toBe('hsl(0, 100%, 50%)');
  });
});
