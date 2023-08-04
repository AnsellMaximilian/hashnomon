import getStats from "@/common/getStats";
import { Dev } from "@/lib/services/devs";

export default function StatsResolver(
  { _id, username, name, numPosts, numReactions, numFollowers }: Dev,
  {}
) {
  return getStats({
    numFollowers: numFollowers || 0,
    numPosts: numPosts || 0,
    numReactions: numReactions || 0,
  });
}
