import getStats from "@/common/getStats";

type User = {
  _id?: string;
  username?: string;
  name?: string;
  numPosts?: number;
  numReactions?: number;
  numFollowers?: number;
};

export default function StatsResolver(
  { _id, username, name, numPosts, numReactions, numFollowers }: User,
  {}
) {
  return getStats({
    numFollowers: numFollowers || 0,
    numPosts: numPosts || 0,
    numReactions: numReactions || 0,
  });
}
