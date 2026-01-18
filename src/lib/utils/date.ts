/**
 * Utility functions for date and time manipulation
 */

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Format time as HH:MM
 */
export function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

/**
 * Format a time option for the time picker display
 * Shows relative text for today, otherwise shows day name
 */
export function formatTimeOption(date: Date, now: Date = new Date()): string {
  const time = formatTime(date);
  const isToday = date.toDateString() === now.toDateString();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today at ${time}`;
  } else if (isTomorrow) {
    return `Tomorrow at ${time}`;
  } else if (isYesterday) {
    return `Yesterday at ${time}`;
  } else {
    const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
    return `${dayName} at ${time}`;
  }
}

/**
 * Get a date offset by hours from now
 */
export function getDateOffsetByHours(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

/**
 * Format offset as PT string for API (e.g., PT00:30:00)
 */
export function formatOffsetForApi(minutes: number): string {
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;
  const sign = minutes < 0 ? "-" : "";
  return `${sign}PT${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:00`;
}

/**
 * Parse a time string (HH:MM) into total minutes from midnight
 */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if a service is delayed based on aimed vs expected times
 */
export function isServiceDelayed(aimed: string, expected: string): boolean {
  return parseTimeToMinutes(expected) > parseTimeToMinutes(aimed);
}

/**
 * Get delay in minutes
 */
export function getDelayMinutes(aimed: string, expected: string): number {
  return parseTimeToMinutes(expected) - parseTimeToMinutes(aimed);
}
