// import getStats from "@/common/getStats";
// import { Dev } from "@/lib/services/devs";

// export default function StatsResolver(
//   { _id, username, name, numPosts, numReactions, numFollowers }: Dev,
//   {}
// ) {
//   return getStats({
//     numFollowers: numFollowers || 0,
//     numPosts: numPosts || 0,
//     numReactions: numReactions || 0,
//   });
// }

export default function StatsResolver(
  {
    numPosts,
    numReactions,
    numFollowers,
  }: { numPosts: number; numReactions: number; numFollowers: number },
  {}
) {
  let totalPoints = numFollowers + numPosts + numReactions;
  return {
    strength: (totalPoints === 0 ? 1 / 3 : numPosts / totalPoints) * 100,
    defense: (totalPoints === 0 ? 1 / 3 : numFollowers / totalPoints) * 100,
    speed: (totalPoints === 0 ? 1 / 3 : numReactions / totalPoints) * 100,
  };
}
