/** Age from the birth year alone (what the profile shows); may be one year too high before the birthday. */
export function ageFromBirthYear(birthYear: number | null, now = new Date()): number | null {
  return birthYear === null ? null : now.getFullYear() - birthYear;
}
