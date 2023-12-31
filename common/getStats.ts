import { DevStats } from "@/lib/services/devs";

type GetStatsFunc = (args: {
  numFollowers: number;
  numReactions: number;
  numPosts: number;
}) => DevStats;

const getStats: GetStatsFunc = ({ numFollowers, numPosts, numReactions }) => {
  let totalPoints = numFollowers + numPosts + numReactions;
  return {
    strength: (totalPoints === 0 ? 1 / 3 : numPosts / totalPoints) * 100,
    defense: (totalPoints === 0 ? 1 / 3 : numFollowers / totalPoints) * 100,
    speed: (totalPoints === 0 ? 1 / 3 : numReactions / totalPoints) * 100,
  };
};

export default getStats;
