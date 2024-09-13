export function DisplayModifier({ value }: Readonly<{ value?: number }>) {
  if (value === undefined || value === 0) {
    return "-";
  } else if (value > 0) {
    return "+" + value;
  } else {
    return value;
  }
}
