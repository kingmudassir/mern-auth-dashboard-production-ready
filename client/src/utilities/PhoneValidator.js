// utils/validators/PhoneValidator.js

// ── Pakistani network prefixes (as of 2024) ──────────────────────────────────
// Source: Pakistan Telecommunication Authority (PTA)
// https://www.pta.gov.pk/en/telecom-indicators
const VALID_PREFIXES = new Set([
  // Jazz / Warid
  '0300', '0301', '0302', '0303', '0304', '0305',
  '0306', '0307', '0308', '0309',

  // Zong
  '0310', '0311', '0312', '0313', '0314', '0315',
  '0316', '0317', '0318', '0319',

  // Ufone
  '0330', '0331', '0332', '0333', '0334', '0335',
  '0336', '0337', '0338', '0339',

  // Telenor
  '0340', '0341', '0342', '0343', '0344', '0345',
  '0346', '0347', '0348', '0349',

  // SCOM (SCO – Gilgit-Baltistan / AJK)
  '0320', '0321', '0322', '0323', '0324', '0325',
]);

/**
 * Validates a Pakistani mobile number in strict local format only.
 * Accepted format: 03XXXXXXXXX (11 digits, no spaces, no dashes, no country code)
 *
 * @param {string} phone
 * @returns {string} - Error message, or empty string if valid.
 */
export function validatePhone(phone) {
  // 1. Presence
  if (!phone || !phone.trim()) return 'Phone number is required';

  // 2. Reject anything that isn't digits (no spaces, dashes, plus signs allowed)
  if (/[^0-9]/.test(phone)) return 'Enter a valid Pakistani mobile number (e.g. 03001234567)';

  // 3. Must be exactly 11 digits
  if (phone.length !== 11) return 'Phone number must be exactly 11 digits';

  // 4. Must start with 03
  if (!phone.startsWith('03')) return 'Enter a valid Pakistani mobile number (e.g. 03001234567)';

  // 5. Must match a real network prefix
  const prefix = phone.slice(0, 4);
  if (!VALID_PREFIXES.has(prefix)) return 'Enter a valid Pakistani mobile network prefix (e.g. 0300, 0321, 0345)';

  // 6. Remaining 7 digits cannot be all the same (e.g. 0300-1111111 — test numbers)
  const subscriber = phone.slice(4);
  if (/^(\d)\1{6}$/.test(subscriber)) return 'Enter a valid phone number';

  return '';
}