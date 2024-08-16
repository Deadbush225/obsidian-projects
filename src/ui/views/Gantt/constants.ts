const perMonth: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthsLongName = [
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
const monthsShortName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function daysPerMonth(index: number, year: number): number {
  let isLeapYear = year % 4 == 0;

  if (isLeapYear && index == 1) {
    return 29;
  }

  return perMonth[index];
}

export function monthFromIndex(index: number): string {
  return monthsLongName[index];
}
