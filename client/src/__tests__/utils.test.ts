import { formatDuration, formatDurationClock, formatYTDate } from '../utils';

describe('formatDuration', () => {
  it('returns Unknown when duration is null', () => {
    expect(formatDuration(null)).toBe('Unknown');
  });

  it('returns Unknown when duration is zero', () => {
    expect(formatDuration(0)).toBe('Unknown');
  });

  it('formats durations shorter than an hour as minutes', () => {
    expect(formatDuration(1800)).toBe('30m');
  });

  it('formats durations longer than an hour with hours and minutes', () => {
    expect(formatDuration(3723)).toBe('1h2m');
  });
});

describe('formatDurationClock', () => {
  it('returns an empty string for null', () => {
    expect(formatDurationClock(null)).toBe('');
  });

  it('returns an empty string for zero or negative durations', () => {
    expect(formatDurationClock(0)).toBe('');
    expect(formatDurationClock(-5)).toBe('');
  });

  it('formats sub-hour durations as M:SS', () => {
    expect(formatDurationClock(90)).toBe('1:30');
  });

  it('zero-pads seconds under ten', () => {
    expect(formatDurationClock(65)).toBe('1:05');
  });

  it('formats durations of an hour or more as H:MM:SS', () => {
    expect(formatDurationClock(3661)).toBe('1:01:01');
  });

  it('floors fractional seconds instead of rendering decimals', () => {
    expect(formatDurationClock(90.7)).toBe('1:30');
  });
});

describe('formatYTDate', () => {
  it('returns Unknown when date is null', () => {
    expect(formatYTDate(null)).toBe('Unknown');
  });

  it('formats a date string by removing leading zeros from month and day', () => {
    expect(formatYTDate('20230102')).toBe('1/2/2023');
  });

  it('keeps double-digit months intact', () => {
    expect(formatYTDate('20231005')).toBe('10/5/2023');
  });
});
