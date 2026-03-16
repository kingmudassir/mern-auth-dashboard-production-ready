// utils/validators/LoginValidator.js

import { validateEmail } from './EmailValidator';
import { validatePasswordLogin } from './PasswordValidator';

/**
 * Validates login form fields.
 * @param {{ email: string, password: string }} fields
 * @returns {{ [key: string]: string }} - Object with field-level error messages.
 */
export function validateLoginFields(fields) {
    const errors = {};

    const emailErr = validateEmail(fields.email);
    if (emailErr) errors.email = emailErr;

    const passwordErr = validatePasswordLogin(fields.password);
    if (passwordErr) errors.password = passwordErr;

    return errors;
}