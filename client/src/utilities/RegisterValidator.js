// utils/validators/RegisterValidator.js

import { validateEmail } from './EmailValidator';
import { validatePasswordStrict } from './PasswordValidator';
import { validatePhone } from './PhoneValidator';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Full name must be:
 * - Present
 * - At least 2 words (first + last name)
 * - Only letters, spaces, hyphens, apostrophes (handles: O'Brien, Al-Farooq)
 * - No excessively long input
 */
function validateFullName(fullName) {
    if (!fullName || !fullName.trim()) return 'Full name is required';

    const trimmed = fullName.trim();

    if (trimmed.length < 3) return 'Enter your full name';
    if (trimmed.length > 100) return 'Name is too long';

    if (!/^[a-zA-Z\u0600-\u06FF]+([ '\-][a-zA-Z\u0600-\u06FF]+)+$/.test(trimmed))
        return 'Enter your first and last name';

    const words = trimmed.split(/\s+/);
    if (words.length < 2) return 'Enter your first and last name';

    return '';
}

/**
 * Confirm password must match password exactly.
 */
function validateConfirm(password, confirm) {
    if (!confirm) return 'Please confirm your password';
    if (confirm !== password) return 'Passwords do not match';
    return '';
}

// ── Main export ──────────────────────────────────────────────────────────────

/**
 * Validates all registration form fields.
 * @param {{ fullName: string, email: string, phone: string, password: string, confirm: string }} fields
 * @returns {{ [key: string]: string }} - Field-level error messages. Empty object means valid.
 */
export function validateRegisterFields(fields, confirmPassword) {
    const errors = {};

    const fullNameErr = validateFullName(fields.name);
    if (fullNameErr) errors.fullName = fullNameErr;

    const emailErr = validateEmail(fields.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = validatePhone(fields.phone);
    if (phoneErr) errors.phone = phoneErr;

    const passwordErr = validatePasswordStrict(fields.password);
    if (passwordErr) errors.password = passwordErr;

    const confirmErr = validateConfirm(fields.password, confirmPassword);
    if (confirmErr) errors.confirm = confirmErr;

    return errors;
}