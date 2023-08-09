interface Params {
  attackerStrength: number;
  defenderDefense: number;
}

export function calculateDamage({
  attackerStrength,
  defenderDefense,
}: Params): number {
  if (attackerStrength <= 0) attackerStrength = 1;
  let damage = 100 + attackerStrength * 10 - defenderDefense;
  return Math.round(damage);
}
