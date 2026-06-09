const {
  isDiscordApprise,
  isSlack,
  isSlackWebhook,
  isTelegram,
  isEmail,
  normalizeAppriseEntry,
} = require('../notificationHelpers');

describe('notificationHelpers', () => {
  describe('isDiscordApprise', () => {
    test('returns true for a discord:// Apprise URL', () => {
      expect(isDiscordApprise('discord://webhook_id/webhook_token')).toBe(true);
    });

    test('returns false for a Discord HTTP webhook', () => {
      expect(isDiscordApprise('https://discord.com/api/webhooks/123/abc')).toBe(false);
    });

    test('returns false for empty or missing input', () => {
      expect(isDiscordApprise('')).toBe(false);
      expect(isDiscordApprise(null)).toBe(false);
      expect(isDiscordApprise(undefined)).toBe(false);
    });
  });

  describe('isSlack', () => {
    test('returns true for a slack:// URL', () => {
      expect(isSlack('slack://token@channel')).toBe(true);
    });

    test('returns true for a Slack incoming webhook', () => {
      expect(isSlack('https://hooks.slack.com/services/T000/B000/XXXX')).toBe(true);
    });

    test('returns false for an unrelated URL', () => {
      expect(isSlack('https://example.com/webhook')).toBe(false);
    });

    test('returns false for missing input', () => {
      expect(isSlack(null)).toBe(false);
    });

    test('isSlackWebhook is an alias for isSlack', () => {
      expect(isSlackWebhook).toBe(isSlack);
    });
  });

  describe('isTelegram', () => {
    test('returns true for tgram:// URLs', () => {
      expect(isTelegram('tgram://bottoken/chatid')).toBe(true);
    });

    test('returns true for telegram:// URLs', () => {
      expect(isTelegram('telegram://bottoken/chatid')).toBe(true);
    });

    test('returns false for unrelated URLs', () => {
      expect(isTelegram('mailto://user@example.com')).toBe(false);
    });

    test('returns false for missing input', () => {
      expect(isTelegram(undefined)).toBe(false);
    });
  });

  describe('isEmail', () => {
    test('returns true for mailto:// URLs', () => {
      expect(isEmail('mailto://user:pass@example.com')).toBe(true);
    });

    test('returns true for mailtos:// URLs', () => {
      expect(isEmail('mailtos://user:pass@example.com')).toBe(true);
    });

    test('returns false for unrelated URLs', () => {
      expect(isEmail('tgram://bottoken/chatid')).toBe(false);
    });

    test('returns false for missing input', () => {
      expect(isEmail('')).toBe(false);
    });
  });

  describe('normalizeAppriseEntry', () => {
    test('normalizes a bare string URL into an object entry', () => {
      const entry = normalizeAppriseEntry('discord://id/token');
      expect(entry.url).toBe('discord://id/token');
      expect(entry.name).toBe('Discord');
      expect(entry.richFormatting).toBe(true);
    });

    test('marks rich formatting false for services without rich support', () => {
      const entry = normalizeAppriseEntry('ntfy://example.com/topic');
      expect(entry.richFormatting).toBe(false);
    });

    test('preserves an existing object entry', () => {
      const entry = normalizeAppriseEntry({
        url: 'slack://token@channel',
        name: 'My Slack',
        richFormatting: true,
      });
      expect(entry.url).toBe('slack://token@channel');
      expect(entry.name).toBe('My Slack');
      expect(entry.richFormatting).toBe(true);
    });

    test('derives a default name when an object entry omits it', () => {
      const entry = normalizeAppriseEntry({ url: 'tgram://bottoken/chatid' });
      expect(entry.name).toBe('Telegram');
    });

    test('treats explicit richFormatting:false as disabled', () => {
      const entry = normalizeAppriseEntry({
        url: 'discord://id/token',
        richFormatting: false,
      });
      expect(entry.richFormatting).toBe(false);
    });

    test('defaults richFormatting to true when omitted on an object entry', () => {
      const entry = normalizeAppriseEntry({ url: 'discord://id/token' });
      expect(entry.richFormatting).toBe(true);
    });
  });
});
