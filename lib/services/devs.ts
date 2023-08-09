import { gql } from "@apollo/client";

export type Dev = {
  _id: string;
  username: string;
  name: string;
  numPosts: number;
  numReactions: number;
  numFollowers: number;
  numFollowing: number;
  photo: string;
  stats: DevStats;
};

export type DevStats = {
  strength: number;
  defense: number;
  speed: number;
};

export type DevQueryResult = {
  hashnode: { user: Dev };
};

export const GetDevQuery = gql`
  query GetDev($username: String!) {
    hashnode {
      user(username: $username) {
        _id
        username
        name
        numFollowers
        numReactions
        numPosts
        numFollowing
        photo
        stats
      }
    }
  }
`;
