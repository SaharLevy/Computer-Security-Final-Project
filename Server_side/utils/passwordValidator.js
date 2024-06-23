const validator = require("validator");
const passwordConfig = require("../config/passwordConfig");

function validatePassword(password) {
  const rules = [];
  const forbiddenWords = ["apple", "noob"];

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

  if (passwordConfig.denyDictionaryWords) {
    const lowerCasePassword = password.toLowerCase();
    forbiddenWords.forEach((word) => {
      if (lowerCasePassword.includes(word)) {
        rules.push(`Password must not contain the forbidden word: ${word}.`);
      }
    });
  }

  // Dictionary check can be added here if needed

  if (rules.length > 0) {
    const error = new Error("Password validation failed.");
    error.details = rules;
    throw error;
  }
}

module.exports = validatePassword;
