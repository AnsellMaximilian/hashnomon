import { DevStats } from "@/lib/services/devs";
import { Move } from "@/lib/services/moves";

interface Params {
  move: Move;
  oldStats: DevStats;
}

export function calculateStatBoost({ move, oldStats }: Params): {
  newStats: DevStats;
  newStatPoint: number;
} {
  let newStat = 0;
  const stats = { ...oldStats };
  if (move.targetStat === "STRENGTH") {
    newStat = stats.strength + move.power;
    stats.strength = newStat;
  } else if (move.targetStat === "DEFENSE") {
    newStat = stats.defense + move.power;
    stats.defense = newStat;
  } else if (move.targetStat === "SPEED") {
    newStat = stats.speed + move.power;
    stats.speed = newStat;
  }
  return { newStats: stats, newStatPoint: newStat };
}
