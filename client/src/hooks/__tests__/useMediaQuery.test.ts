import { renderHook, act } from '@testing-library/react';
import { useMediaQuery, breakpoints } from '../useMediaQuery';

type Listener = (event: MediaQueryListEvent) => void;

interface FakeMediaQueryList {
  matches: boolean;
  media: string;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  _fire: (matches: boolean) => void;
}

function installMatchMedia(initialMatches: boolean) {
  const listeners: Listener[] = [];
  const mql: FakeMediaQueryList = {
    matches: initialMatches,
    media: '',
    addEventListener: jest.fn((_event: string, cb: Listener) => {
      listeners.push(cb);
    }),
    removeEventListener: jest.fn((_event: string, cb: Listener) => {
      const idx = listeners.indexOf(cb);
      if (idx >= 0) listeners.splice(idx, 1);
    }),
    _fire: (matches: boolean) => {
      mql.matches = matches;
      listeners.forEach((cb) => cb({ matches } as MediaQueryListEvent));
    },
  };
  window.matchMedia = jest.fn().mockImplementation((query: string) => {
    mql.media = query;
    return mql;
  }) as unknown as typeof window.matchMedia;
  return mql;
}

describe('useMediaQuery', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns the initial match state', () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(true);
  });

  test('returns false when the query does not match', () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(false);
  });

  test('updates when the media query change event fires', () => {
    const mql = installMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(false);

    act(() => {
      mql._fire(true);
    });

    expect(result.current).toBe(true);
  });

  test('strips the optional "@media " prefix before querying', () => {
    installMatchMedia(false);
    renderHook(() => useMediaQuery('@media (min-width: 900px)'));
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 900px)');
  });

  test('removes its change listener on unmount', () => {
    const mql = installMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    unmount();
    expect(mql.removeEventListener).toHaveBeenCalled();
  });
});

describe('breakpoints helpers', () => {
  test('up() builds a min-width query for each breakpoint', () => {
    expect(breakpoints.up('xs')).toBe('(min-width:0px)');
    expect(breakpoints.up('sm')).toBe('(min-width:600px)');
    expect(breakpoints.up('md')).toBe('(min-width:900px)');
    expect(breakpoints.up('lg')).toBe('(min-width:1200px)');
    expect(breakpoints.up('xl')).toBe('(min-width:1536px)');
  });

  test('down() builds a max-width query just below the next breakpoint', () => {
    expect(breakpoints.down('xs')).toBe('(max-width:599.95px)');
    expect(breakpoints.down('sm')).toBe('(max-width:899.95px)');
    expect(breakpoints.down('md')).toBe('(max-width:1199.95px)');
    expect(breakpoints.down('lg')).toBe('(max-width:1535.95px)');
    expect(breakpoints.down('xl')).toBe('(max-width:9999px)');
  });
});
