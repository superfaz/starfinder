export function Credits({ value }: Readonly<{ value?: number }>) {
  if (value === undefined || value === 0) {
    return "- Cr";
  } else {
    return value + " Cr";
  }
}
