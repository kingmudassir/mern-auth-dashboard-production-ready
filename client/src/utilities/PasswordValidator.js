// utils/validators/PasswordValidator.js

const MIN_LENGTH = 8;

const RULES = [
    {
        id: 'minLength',
        test: (pw) => pw.length >= MIN_LENGTH,
        message: `At least ${MIN_LENGTH} characters`,
    },
    {
        id: 'uppercase',
        test: (pw) => /[A-Z]/.test(pw),
        message: 'At least one uppercase letter',
    },
    {
        id: 'lowercase',
        test: (pw) => /[a-z]/.test(pw),
        message: 'At least one lowercase letter',
    },
    {
        id: 'number',
        test: (pw) => /[0-9]/.test(pw),
        message: 'At least one number',
    },
    {
        id: 'special',
        test: (pw) => /[^A-Za-z0-9]/.test(pw),
        message: 'At least one special character',
    },
];

/**
 * Returns the first failing rule's message, or empty string if valid.
 * Use this for Login — just needs a non-empty check + basic format.
 * @param {string} password
 * @returns {string}
 */
export function validatePasswordLogin(password) {
    if (!password) return 'Password is required';
    return '';
}

/**
 * Returns the first failing rule's message, or empty string if all pass.
 * Use this for Register / Change Password — enforces all rules.
 * @param {string} password
 * @returns {string}
 */
export function validatePasswordStrict(password) {
    if (!password) return 'Password is required';

    for (const rule of RULES) {
        if (!rule.test(password)) return rule.message;
    }

    return '';
}

/**
 * Returns full rule list with pass/fail state for each.
 * Use this to drive a live password strength checklist in the UI.
 * @param {string} password
 * @returns {{ id: string, message: string, passed: boolean }[]}
 */
export function getPasswordRuleStatus(password) {
    return RULES.map((rule) => ({
        id: rule.id,
        message: rule.message,
        passed: rule.test(password),
    }));
}

/**
 * Returns a strength label based on how many rules pass.
 * @param {string} password
 * @returns {{ label: 'Weak' | 'Fair' | 'Strong', score: number }}
 */
export function getPasswordStrength(password) {
    const passed = RULES.filter((rule) => rule.test(password)).length;

    if (passed <= 2) return { label: 'Weak', score: passed };
    if (passed <= 4) return { label: 'Fair', score: passed };
    return { label: 'Strong', score: passed };
}