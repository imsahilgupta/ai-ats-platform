/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const isValid = password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  return {
    isValid,
    errors: [
      !isValid && password.length < minLength && `Password must be at least ${minLength} characters long`,
      !hasUppercase && "Password must contain at least one uppercase letter",
      !hasLowercase && "Password must contain at least one lowercase letter",
      !hasNumber && "Password must contain at least one number",
      !hasSpecialChar && "Password must contain at least one special character (!@#$%^&*)",
    ].filter(Boolean),
  };
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format
 */
function validateUsername(username) {
  // Allow alphanumeric, underscore, and hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

module.exports = {
  validatePasswordStrength,
  validateEmail,
  validateUsername,
};
