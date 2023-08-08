import { gql } from "@apollo/client";
import api from "../axios";

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

export const getDevQuery = `
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

export const getDev = async (username: string) => {
  const res = await api.post(
    "",
    {
      query: getDevQuery,
      variables: {
        username: username,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    }
  );

  if (res.data.errors) throw new Error("No dev has that username.");

  return res.data.data.hashnode.user as Dev;
};
