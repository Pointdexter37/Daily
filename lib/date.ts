const pad = (value: number) => String(value).padStart(2, "0");

export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

export function addDays(key: string, offset: number) {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + offset);
  return todayKey(date);
}

export function recentDates(days: number) {
  const current = todayKey();
  return Array.from({ length: days }, (_, index) => addDays(current, -index));
}
