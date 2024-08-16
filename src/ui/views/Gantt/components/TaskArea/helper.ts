export function _range(min: number, max: number): number[] {
  let s: number[] = Array.from({ length: max }, (e, i) => i + 1);
  // need plus one since Dates are not 0 indexed

  let r: number[] = s.filter((x) => {
    if (x >= min) {
      return x;
    }
  });

  return r;
}

export function daysFromNow(date: Date): number {
  //   console.log(typeof date);
  if (date === undefined) {
    return 0;
  }

  let now: Date = new Date();
  let diffInMIliSeconds: number = date.getTime() - now.getTime();
  let diffInDays: number = Math.ceil(diffInMIliSeconds / (1000 * 3600 * 24));
  return diffInDays;
}
