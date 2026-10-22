export const NO_EMAIL_PLACEHOLDER = "no-email@extensionwater.local";

export function displayEmail(email: string): string {
  return email === NO_EMAIL_PLACEHOLDER ? "Not provided" : email;
}
