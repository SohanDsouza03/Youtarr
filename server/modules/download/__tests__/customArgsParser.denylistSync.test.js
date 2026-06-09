const fs = require('fs');
const path = require('path');
const { BLOCKED_FLAGS } = require('../customArgsParser');

/**
 * The server denylist (customArgsParser.js) and the client denylist
 * (ytdlpOptionsHelpers.ts) are duplicated by design and carry "KEEP IN SYNC"
 * comments. This test fails loudly if they ever drift, since a client-only
 * flag would let a blocked yt-dlp option reach the server-side validator's
 * dry run before being rejected (or vice versa).
 */
describe('yt-dlp custom-args denylist sync', () => {
  const clientHelpersPath = path.join(
    __dirname,
    '../../../../client/src/components/Configuration/sections/ytdlpOptionsHelpers.ts'
  );

  /**
   * Extract the BLOCKED_FLAGS string literals from the client TS source
   * without transpiling it. The Set is declared as
   * `export const BLOCKED_FLAGS = new Set<string>([ ... ]);`.
   */
  function parseClientBlockedFlags(source) {
    const start = source.indexOf('BLOCKED_FLAGS');
    expect(start).toBeGreaterThanOrEqual(0);
    const open = source.indexOf('[', start);
    const close = source.indexOf(']', open);
    expect(open).toBeGreaterThan(start);
    expect(close).toBeGreaterThan(open);
    const block = source.slice(open + 1, close);
    const matches = block.match(/'([^']+)'/g) || [];
    return new Set(matches.map((m) => m.slice(1, -1)));
  }

  test('client and server denylists contain exactly the same flags', () => {
    const source = fs.readFileSync(clientHelpersPath, 'utf8');
    const clientFlags = parseClientBlockedFlags(source);

    const serverFlags = [...BLOCKED_FLAGS].sort();
    const clientFlagsSorted = [...clientFlags].sort();

    expect(clientFlagsSorted).toEqual(serverFlags);
  });
});
