/**
 * Utilities for calculating working hours, supporting overnight spans,
 * and formatting time ranges.
 */

export interface CalculatedDuration {
  valid: boolean;
  total_minutes: number;
  total_hours: number;
  hours_spent: number;
  minutes_spent: number;
  is_overnight: boolean;
  formatted_duration: string;
  error?: string;
}

export function calculateWorkingHours(startTime: string, endTime: string): CalculatedDuration {
  if (!startTime || !endTime) {
    return {
      valid: false,
      total_minutes: 0,
      total_hours: 0,
      hours_spent: 0,
      minutes_spent: 0,
      is_overnight: false,
      formatted_duration: '0h 0m',
      error: 'Start time and End time are required',
    };
  }

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  if (
    isNaN(startH) || isNaN(startM) ||
    isNaN(endH) || isNaN(endM) ||
    startH < 0 || startH > 23 || startM < 0 || startM > 59 ||
    endH < 0 || endH > 23 || endM < 0 || endM > 59
  ) {
    return {
      valid: false,
      total_minutes: 0,
      total_hours: 0,
      hours_spent: 0,
      minutes_spent: 0,
      is_overnight: false,
      formatted_duration: '0h 0m',
      error: 'Invalid time format. Please provide HH:MM.',
    };
  }

  const startTotalMinutes = startH * 60 + startM;
  let endTotalMinutes = endH * 60 + endM;
  let isOvernight = false;

  // If end time is earlier than or equal to start time, it wraps past midnight
  if (endTotalMinutes <= startTotalMinutes) {
    // Overnight work session (e.g. 22:00 to 02:00 -> +24 hours)
    endTotalMinutes += 24 * 60;
    isOvernight = true;
  }

  const diffMinutes = endTotalMinutes - startTotalMinutes;

  if (diffMinutes === 0) {
    return {
      valid: false,
      total_minutes: 0,
      total_hours: 0,
      hours_spent: 0,
      minutes_spent: 0,
      is_overnight: false,
      formatted_duration: '0h 0m',
      error: 'Duration cannot be 0 minutes.',
    };
  }

  if (diffMinutes > 24 * 60) {
    return {
      valid: false,
      total_minutes: 0,
      total_hours: 0,
      hours_spent: 0,
      minutes_spent: 0,
      is_overnight: false,
      formatted_duration: '0h 0m',
      error: 'A single work submission cannot exceed 24 hours.',
    };
  }

  const hoursSpent = Math.floor(diffMinutes / 60);
  const minutesSpent = diffMinutes % 60;
  const totalHoursDecimal = Number((diffMinutes / 60).toFixed(2));

  return {
    valid: true,
    total_minutes: diffMinutes,
    total_hours: totalHoursDecimal,
    hours_spent: hoursSpent,
    minutes_spent: minutesSpent,
    is_overnight: isOvernight,
    formatted_duration: `${hoursSpent}h ${minutesSpent}m`,
  };
}

export function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  const minutePadded = m < 10 ? `0${m}` : m;
  return `${hour12}:${minutePadded} ${ampm}`;
}

export function formatDatePretty(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
