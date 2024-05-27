import { Alignment, Ethics, Moralities } from "model";

export function computeSteps(a: Alignment, b: Alignment): number {
  return (
    Math.abs(Moralities.indexOf(a.morality) - Moralities.indexOf(b.morality)) +
    Math.abs(Ethics.indexOf(a.ethic) - Ethics.indexOf(b.ethic))
  );
}
