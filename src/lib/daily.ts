/** Day of the year (1–366) for a calendar date, independent of time zone and daylight saving. */
function dayOfYear(year: number, month: number, day: number) {
  return Math.round((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86_400_000);
}

/** Calendar date parts for `date` in `timeZone` (or the device's own zone). */
export function localDate(date = new Date(), timeZone?: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const year = get("year");
  const month = get("month");
  const day = get("day");
  return {
    year,
    month,
    day,
    hour: get("hour") % 24,
    iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
}

/**
 * Index of today's encouragement. Everyone in the same time zone sees the same one,
 * and the daily reminder sends the same one the home screen shows.
 */
export function dailyIndex(count: number, date = new Date(), timeZone?: string) {
  if (!count) return 0;
  const { year, month, day } = localDate(date, timeZone);
  return dayOfYear(year, month, day) % count;
}
