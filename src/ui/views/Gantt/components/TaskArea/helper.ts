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
