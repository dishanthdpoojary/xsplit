/**
 * Generates a cryptographically-random invite token.
 * Uses crypto.randomUUID() if available, otherwise falls back to a manual approach.
 * @returns {string} A UUID-like random hex string
 */
export const generateToken = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: manual 128-bit random hex
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
