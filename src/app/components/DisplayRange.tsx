export function DisplayRange({ value }: Readonly<{ value?: number }>) {
  if (value === undefined || value === 0) {
    return "-";
  } else {
    return value * 1.5 + " m";
  }
}
