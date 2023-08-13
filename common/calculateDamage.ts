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
  let damage =
    (attackerStrength * move.power) / 3.5 - defenderDefense * 1.5 + 10;
  return Math.round(damage >= 0 ? damage : 1);
}
