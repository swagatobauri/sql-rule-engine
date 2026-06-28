// Shared react-hook-form validation rules for the auth forms.
// Kept here so login and signup enforce identical email/password constraints.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const nameRules = {
  required: "Full name is required",
  minLength: { value: 2, message: "Name must be at least 2 characters" },
  maxLength: { value: 60, message: "Name must be under 60 characters" },
};

export const emailRules = {
  required: "Email is required",
  pattern: { value: EMAIL_REGEX, message: "Enter a valid email address" },
};

export const passwordRules = {
  required: "Password is required",
  minLength: { value: 8, message: "Password must be at least 8 characters" },
  validate: {
    hasLetter: (v) => /[A-Za-z]/.test(v) || "Include at least one letter",
    hasNumber: (v) => /[0-9]/.test(v) || "Include at least one number",
  },
};

// Sign-in password only needs to be present — strength is enforced at sign-up.
export const loginPasswordRules = {
  required: "Password is required",
};

export const confirmPasswordRules = (getValues) => ({
  required: "Please confirm your password",
  validate: (v) => v === getValues("password") || "Passwords do not match",
});
