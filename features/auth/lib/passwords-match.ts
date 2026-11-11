/** Sign-up check: both entries are identical (no trimming: spaces are part of a password). */
export function passwordsMatch(password: string, confirmation: string): boolean {
  return password === confirmation;
}
