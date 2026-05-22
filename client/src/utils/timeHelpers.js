export const DAY_NAMES = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
];



export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];



export const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];



export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {

  const hour = String(Math.floor(i / 2)).padStart(2, "0");

  const minute = i % 2 === 0 ? "00" : "30";

  return `${hour}:${minute}`;
}
);



// YYYY-MM-DD
export function toDateStr(date) {

  return date.toISOString().split("T")[0];
}



// TODAY DATE
export function todayStr() {

  return toDateStr(new Date());
}


// DAYS IN MONTH
export function getDaysInMonth(year, month) {

  return new Date(year, month + 1, 0).getDate();
}



// MONDAY = 0
export function getFirstDayOfMonth(year, month) {

  const jsDay = new Date(year, month, 1).getDay();

  return jsDay === 0 ? 6 : jsDay - 1;
}



// CHECK PAST DATE
export function isDatePast(dateStr) {

  return dateStr < todayStr();
}



// FORMAT TIME
export function formatTime(t) {

  const [h, m] =
    t.split(":").map(Number);

  const ampm = h >= 12 ? "PM" : "AM";

  const hh = h % 12 || 12;

  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}



// Monday, June 9
export function formatDateLong(dateStr) {

  const dt = new Date(dateStr + "T12:00:00");

  return dt.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );
}



// Monday, June 9, 2025
export function formatDateFull(dateStr) {

  const dt = new Date(dateStr);

  if (isNaN(dt)) {
    return "Invalid Date";
  }

  return dt.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}



// Mon, Jun 9, 2025
export function formatDateShort(dateStr) {

  const dt = new Date(dateStr);

  if (isNaN(dt)) {
    return "Invalid Date";
  }

  return dt.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}



// Jun 9
export function formatMonthDay(dateStr) {

  const dt = new Date(dateStr + "T12:00:00");

  return dt.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}



// BUILD YYYY-MM-DD
export function buildDateStr(year, month, day) {

  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}