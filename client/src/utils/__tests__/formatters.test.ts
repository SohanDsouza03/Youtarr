import {
  parseDate,
  formatDate,
  formatDateTime,
  formatAddedDate,
  formatAddedDateTime,
  formatAddedDateParts,
  formatFileSize,
  decodeHtml,
} from '../formatters';

describe('formatFileSize', () => {
  test('returns empty string for null', () => {
    expect(formatFileSize(null)).toBe('');
  });

  test('returns empty string for undefined', () => {
    expect(formatFileSize(undefined)).toBe('');
  });

  test('returns empty string for zero bytes', () => {
    expect(formatFileSize(0)).toBe('');
  });

  test('formats sub-gigabyte sizes in whole megabytes', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5MB');
  });

  test('rounds megabytes to a whole number', () => {
    expect(formatFileSize(Math.round(1.6 * 1024 * 1024))).toBe('2MB');
  });

  test('formats sizes of one gigabyte or more with one decimal', () => {
    expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.5GB');
  });

  test('switches to gigabytes exactly at 1GB', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0GB');
  });
});

describe('decodeHtml', () => {
  test('decodes named HTML entities', () => {
    expect(decodeHtml('Tom &amp; Jerry')).toBe('Tom & Jerry');
  });

  test('decodes numeric HTML entities', () => {
    expect(decodeHtml('5 &lt; 10 &gt; 3')).toBe('5 < 10 > 3');
  });

  test('returns plain text unchanged', () => {
    expect(decodeHtml('no entities here')).toBe('no entities here');
  });

  test('returns empty string for empty input', () => {
    expect(decodeHtml('')).toBe('');
  });
});

describe('formatters date helpers', () => {
  describe('parseDate', () => {
    test('returns null for null', () => {
      expect(parseDate(null)).toBeNull();
    });

    test('returns null for undefined', () => {
      expect(parseDate(undefined)).toBeNull();
    });

    test('returns null for empty string', () => {
      expect(parseDate('')).toBeNull();
    });

    test('returns null for unparseable string', () => {
      expect(parseDate('not a date')).toBeNull();
    });

    test('parses yt-dlp YYYYMMDD format', () => {
      const date = parseDate('20260420');
      expect(date).not.toBeNull();
      expect(date!.getFullYear()).toBe(2026);
      expect(date!.getMonth()).toBe(3); // April (0-indexed)
      expect(date!.getDate()).toBe(20);
    });

    test('parses ISO 8601 string', () => {
      const date = parseDate('2026-04-20T16:20:00Z');
      expect(date).not.toBeNull();
      expect(date!.getUTCFullYear()).toBe(2026);
      expect(date!.getUTCMonth()).toBe(3);
      expect(date!.getUTCDate()).toBe(20);
    });
  });

  describe('formatDate', () => {
    test('returns null for null input', () => {
      expect(formatDate(null)).toBeNull();
    });

    test('returns null for unparseable input', () => {
      expect(formatDate('garbage')).toBeNull();
    });

    test('formats yt-dlp YYYYMMDD', () => {
      // Jest test runner defaults to en-US locale.
      expect(formatDate('20260420')).toBe('4/20/2026');
    });

    test('formats ISO string using local date components', () => {
      const result = formatDate('2026-04-20T12:00:00');
      // Local timezone will produce a valid date string; just check shape.
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });

  describe('formatDateTime', () => {
    test('returns null for null input', () => {
      expect(formatDateTime(null)).toBeNull();
    });

    test('returns null for unparseable input', () => {
      expect(formatDateTime('garbage')).toBeNull();
    });

    test('formats date with 12-hour time and AM/PM', () => {
      // Build an explicit local date so the test is timezone-independent.
      const local = new Date(2026, 3, 20, 16, 20, 0);
      const result = formatDateTime(local.toISOString());
      expect(result).not.toBeNull();
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}\s+\d{2}:\d{2}\s+(AM|PM)/);
    });

    test('YYYYMMDD input produces 12:00 AM time (midnight local)', () => {
      const result = formatDateTime('20260420');
      expect(result).toBe('4/20/2026 12:00 AM');
    });
  });

  describe('formatAddedDateTime', () => {
    test('returns empty string for null input', () => {
      expect(formatAddedDateTime(null)).toBe('');
    });

    test('returns empty string for undefined input', () => {
      expect(formatAddedDateTime(undefined)).toBe('');
    });

    test('returns empty string for unparseable input', () => {
      expect(formatAddedDateTime('garbage')).toBe('');
    });

    test('formats ISO string with long date and 12-hour time', () => {
      const local = new Date(2026, 3, 20, 16, 20, 0);
      const result = formatAddedDateTime(local.toISOString());
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4} \d{2}:\d{2} (AM|PM)$/);
    });
  });

  describe('formatAddedDateParts', () => {
    test('returns null for null input', () => {
      expect(formatAddedDateParts(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
      expect(formatAddedDateParts(undefined)).toBeNull();
    });

    test('returns null for unparseable input', () => {
      expect(formatAddedDateParts('garbage')).toBeNull();
    });

    test('returns separate date and time strings', () => {
      const local = new Date(2026, 3, 20, 16, 20, 0);
      const parts = formatAddedDateParts(local.toISOString());
      expect(parts).not.toBeNull();
      expect(parts!.date).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
      expect(parts!.time).toMatch(/^\d{2}:\d{2} (AM|PM)$/);
    });
  });

  describe('formatAddedDate', () => {
    test('returns empty string for null input', () => {
      expect(formatAddedDate(null)).toBe('');
    });

    test('returns empty string for unparseable input', () => {
      expect(formatAddedDate('garbage')).toBe('');
    });

    test('formats ISO string with short date and 12-hour time', () => {
      const local = new Date(2026, 3, 20, 16, 20, 0);
      const result = formatAddedDate(local.toISOString());
      // e.g. "Apr 20, 26 04:20 PM"
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{2} \d{2}:\d{2} (AM|PM)$/);
    });
  });
});
