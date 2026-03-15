'use client';

/**
 * Safely converts any object to JSON, handling:
 * 1. Circular references
 * 2. Firebase Timestamps
 * 3. undefined values
 */
export const safeStringify = (obj: any): string => {
  const seen = new WeakSet();

  return JSON.stringify(obj, (key, value) => {
    // Handle Firebase Timestamps (if they have a toDate method)
    if (value && typeof value === "object" && typeof value.toDate === 'function') {
      return value.toDate().toISOString();
    }

    // Handle circular references
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return undefined; // Drop circular reference
      }
      seen.add(value);
    }

    // Drop undefined values
    if (value === undefined) return null;

    return value;
  });
};
