import { Move } from "@/lib/services/moves";

interface Params {
  move: Move;
  attackerStrength: number;
  defenderDefense: number;
}

export function calculateDamage({
  move,
  attackerStrength,
  defenderDefense,
}: Params): number {
  if (attackerStrength <= 0) attackerStrength = 1;
  let damage = (attackerStrength * move.power) / 4 - defenderDefense * 2.5 + 10;
  return Math.round(damage >= 0 ? damage : 10);
}
