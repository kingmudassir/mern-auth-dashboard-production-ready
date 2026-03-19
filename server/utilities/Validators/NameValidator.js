// utilities/validators/NameValidator.js

const MIN_LENGTH = 2;
const MAX_LENGTH = 50;

/**
 * Validates a full name.
 * Rules:
 * - Required
 * - 2–50 characters
 * - Only letters, spaces, hyphens, and apostrophes
 * - Each word must be at least 2 letters
 * - No consecutive spaces, hyphens, or apostrophes
 * - Cannot start or end with a space, hyphen, or apostrophe
 *
 * @param {string} name
 * @returns {string} - Error message, or empty string if valid.
 */
export function validateName(name) {
    // 1. Presence
    if (!name || typeof name !== 'string') return 'Name is required';

    const trimmed = name.trim();

    if (!trimmed) return 'Name is required';

    // 2. Length
    if (trimmed.length < MIN_LENGTH) return `Name must be at least ${MIN_LENGTH} characters`;
    if (trimmed.length > MAX_LENGTH) return `Name must be at most ${MAX_LENGTH} characters`;

    // 3. Cannot start or end with hyphen or apostrophe
    if (/^['\-]|['\-]$/.test(trimmed)) return 'Name cannot start or end with a hyphen or apostrophe';

    // 4. Only allowed characters: letters, spaces, hyphens, apostrophes
    if (/[^a-zA-Z\s'\-]/.test(trimmed)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';

    // 5. No consecutive special characters (e.g. "--", "''", "-'", "'-")
    if (/['\-]{2,}/.test(trimmed)) return 'Name cannot contain consecutive hyphens or apostrophes';

    // 6. No consecutive spaces
    if (/\s{2,}/.test(trimmed)) return 'Name cannot contain consecutive spaces';

    // 7. Each word must be at least 2 letters
    const words = trimmed.split(/\s+/);
    for (const word of words) {
        const letters = word.replace(/['\-]/g, '');
        if (letters.length < 2) return 'Each part of the name must have at least 2 letters';
    }

    return '';
}