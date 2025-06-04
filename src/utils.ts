import path from 'path';
import fs from 'fs';
import diff, { Diff } from 'deep-diff';

/**
 * Returns the absolute path to a locale JSON file.
 * @param rootDir - The root directory of the project.
 * @param dir - The directory where translation files are stored (relative to rootDir).
 * @param locale - The locale code (e.g., "en", "fr").
 * @returns The absolute path to the locale JSON file.
 */
export function getLocalePath(rootDir: string, dir: string, locale: string): string {
  return path.resolve(rootDir, dir, `${locale}.json`);
}

/**
 * Ensures that a file exists at the given path.
 * If the file does not exist, it creates an empty JSON object file.
 * @param filePath - The path to the file to check or create.
 */
export function ensureFile(filePath: string): void {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '{}');
}

/**
 * Type representing a nested object structure for translations.
 */
type NestedObject = { [key: string]: string | number | boolean | NestedObject };

/**
 * Type representing a flat object with dot notation keys.
 */
type FlatObject = { [key: string]: string | number | boolean };

/**
 * Merges a flat object (with dot notation keys) into a nested object.
 * This is used to update a nested translation object with new/updated keys.
 * @param nestedObj - The nested object to merge into (will be mutated).
 * @param flatObj - The flat object with dot notation keys and values.
 * @returns The updated nested object.
 */
export function mergeFlatToNested(nestedObj: NestedObject, flatObj: FlatObject) {
  for (const flatKey in flatObj) {
    const value = flatObj[flatKey];
    const keys = flatKey.split('.');
    let current: Record<string, unknown> = nestedObj;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        // Last key, set value
        current[key] = value;
      } else {
        // If the key does not exist or is not an object, create an empty object
        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {};
        }
        current = current[key] as Record<string, unknown>;
      }
    }
  }
  return nestedObj;
}

/**
 * Helper function to flatten a nested object into a flat object with dot notation keys.
 * Example: { a: { b: "c" } } => { "a.b": "c" }
 * @param obj - The object to flatten.
 * @param prefix - The prefix for keys (used for recursion).
 * @param res - The result object (used for recursion).
 * @returns The flattened object.
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
  res: FlatObject = {},
): FlatObject {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively flatten nested objects
        flattenObject(value as Record<string, unknown>, newKey, res);
      } else {
        res[newKey] = value as string | number | boolean;
      }
    }
  }
  return res;
}

/**
 * Compares two translation objects and finds keys that are missing in the target.
 * Returns the source, target, and a flat object of missing keys/values.
 * @param source - The source translation object (reference).
 * @param target - The target translation object (to check for missing keys).
 * @returns An object containing the source, target, and missingKeys (flat object).
 */
export function compareTranslations(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
): {
  source: Record<string, unknown>;
  target: Record<string, unknown>;
  missingKeys: FlatObject;
} {
  // Find all differences between source and target
  const differences: Diff<Record<string, unknown>, Record<string, unknown>>[] =
    diff(source, target) || [];
  const missingKeys: FlatObject = {};

  differences.forEach((d) => {
    if (d.kind === 'N') {
      // "N" = new in target, not missing in target, so skip
      return;
    }
    if (d.kind === 'D') {
      // "D" = deleted in target, so missing in target
      // Build the flat key path as "a.b.c"
      const flatKey = d.path?.join('.') ?? '';
      if (d.lhs && typeof d.lhs === 'object' && !Array.isArray(d.lhs)) {
        // If the missing value is an object, flatten it and add with proper prefix
        const flatObj = flattenObject(d.lhs as Record<string, unknown>, flatKey);
        Object.assign(missingKeys, flatObj);
      } else {
        // Otherwise, add the missing value directly
        missingKeys[flatKey] = d.lhs as unknown as string | number | boolean;
      }
    }
    // We ignore "E" (edited) for missing keys in this context
  });

  return { source, target, missingKeys };
}
