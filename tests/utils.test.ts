import { describe, it, expect } from 'vitest';
import { getLocalePath, mergeFlatToNested, compareTranslations } from '../src/utils';
import path from 'path';

describe('utils', () => {
  describe('getLocalePath', () => {
    it('should return the correct path for a locale file', () => {
      const rootDir = '/project';
      const dir = 'locales';
      const locale = 'en';
      const expected = path.resolve('/project/locales/en.json');
      expect(getLocalePath(rootDir, dir, locale)).toBe(expected);
    });
  });

  describe('mergeFlatToNested', () => {
    it('should merge flat object into nested structure', () => {
      const nested = {
        a: {
          b: 'old',
        },
      };
      const flat = {
        'a.b': 'new',
        'c.d': 'value',
      };
      const result = mergeFlatToNested(nested, flat);
      expect(result).toEqual({
        a: {
          b: 'new',
        },
        c: {
          d: 'value',
        },
      });
    });

    it('should handle non-string values', () => {
      const nested = {};
      const flat = {
        'a.b': 123,
        'c.d': true,
      };
      const result = mergeFlatToNested(nested, flat);
      expect(result).toEqual({
        a: {
          b: 123,
        },
        c: {
          d: true,
        },
      });
    });
  });

  describe('compareTranslations', () => {
    it('should detect missing keys in target', () => {
      const source = {
        a: {
          b: 'value1',
          c: 'value2',
        },
        d: 'value3',
      };
      const target = {
        a: {
          b: 'value1',
        },
      };
      const { missingKeys } = compareTranslations(source, target);
      expect(missingKeys).toEqual({
        'a.c': 'value2',
        d: 'value3',
      });
    });

    it('should handle empty objects', () => {
      const source = {};
      const target = {};
      const { missingKeys } = compareTranslations(source, target);
      expect(missingKeys).toEqual({});
    });

    it('should handle nested missing objects', () => {
      const source = {
        a: {
          b: {
            c: 'value',
          },
        },
      };
      const target = {};
      const { missingKeys } = compareTranslations(source, target);
      expect(missingKeys).toEqual({
        'a.b.c': 'value',
      });
    });

    it('should handle different value types', () => {
      const source = {
        a: 123,
        b: true,
        c: 'string',
      };
      const target = {
        a: 123,
      };
      const { missingKeys } = compareTranslations(source, target);
      expect(missingKeys).toEqual({
        b: true,
        c: 'string',
      });
    });
  });
});
