const {
  TAB_TYPES,
  MEDIA_TAB_TYPE_MAP,
  VALID_TAB_TYPES,
  parseTabCsv,
} = require('../tabsUtils');

describe('tabsUtils', () => {
  describe('TAB_TYPES', () => {
    test('exposes the canonical tab identifiers', () => {
      expect(TAB_TYPES.VIDEOS).toBe('videos');
      expect(TAB_TYPES.SHORTS).toBe('shorts');
      expect(TAB_TYPES.LIVE).toBe('streams');
    });

    test('is frozen to prevent mutation', () => {
      expect(Object.isFrozen(TAB_TYPES)).toBe(true);
    });
  });

  describe('MEDIA_TAB_TYPE_MAP', () => {
    test('maps each tab type to its media type', () => {
      expect(MEDIA_TAB_TYPE_MAP.videos).toBe('video');
      expect(MEDIA_TAB_TYPE_MAP.shorts).toBe('short');
      expect(MEDIA_TAB_TYPE_MAP.streams).toBe('livestream');
    });

    test('is frozen to prevent mutation', () => {
      expect(Object.isFrozen(MEDIA_TAB_TYPE_MAP)).toBe(true);
    });
  });

  describe('VALID_TAB_TYPES', () => {
    test('contains every canonical tab type', () => {
      expect(VALID_TAB_TYPES.has('videos')).toBe(true);
      expect(VALID_TAB_TYPES.has('shorts')).toBe(true);
      expect(VALID_TAB_TYPES.has('streams')).toBe(true);
    });

    test('rejects unknown tab types', () => {
      expect(VALID_TAB_TYPES.has('playlists')).toBe(false);
    });
  });

  describe('parseTabCsv', () => {
    test('returns an empty array for null', () => {
      expect(parseTabCsv(null)).toEqual([]);
    });

    test('returns an empty array for undefined', () => {
      expect(parseTabCsv(undefined)).toEqual([]);
    });

    test('returns an empty array for an empty string', () => {
      expect(parseTabCsv('')).toEqual([]);
    });

    test('splits a comma-separated list', () => {
      expect(parseTabCsv('videos,shorts,streams')).toEqual(['videos', 'shorts', 'streams']);
    });

    test('trims surrounding whitespace from each entry', () => {
      expect(parseTabCsv(' videos , shorts ')).toEqual(['videos', 'shorts']);
    });

    test('drops empty entries from trailing or doubled commas', () => {
      expect(parseTabCsv('videos,,shorts,')).toEqual(['videos', 'shorts']);
    });
  });
});
