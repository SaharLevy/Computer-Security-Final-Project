const validator = require("validator");
const passwordConfig = require("../config/passwordConfig");

function validatePassword(password) {
  const rules = [];

  if (password.length < passwordConfig.passwordLength) {
    rules.push(
      `Password must be at least ${passwordConfig.passwordLength} characters long.`
    );
  }

  if (passwordConfig.requireUpperCase && !/[A-Z]/.test(password)) {
    rules.push("Password must contain at least one uppercase letter.");
  }

  if (passwordConfig.requireLowerCase && !/[a-z]/.test(password)) {
    rules.push("Password must contain at least one lowercase letter.");
  }

  if (passwordConfig.requireDigits && !/[0-9]/.test(password)) {
    rules.push("Password must contain at least one digit.");
  }

  if (
    passwordConfig.requireSpecialChars &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    rules.push("Password must contain at least one special character.");
  }

  // Dictionary check can be added here if needed

  return rules;
}

module.exports = validatePassword;
