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

export const GetUserDevsQuery = gql`
  query UserDevs($userId: String!) {
    userDevs(by: { userId: $userId }) {
      userId
      devs
      id
    }
  }
`;

export type GetUserDevsQueryResult = {
  userDevs: { userId: string; id: string; devs: string[] };
};

export const CreateUserDevsQuery = gql`
  mutation UserDevsCreate($userId: String!, $firstDevId: String!) {
    userDevsCreate(input: { userId: $userId, devs: [$firstDevId] }) {
      userDevs {
        userId
        devs
      }
    }
  }
`;

export type CreateUserDevsQueryResult = {
  userDevs: { userId: string; id: string; devs: string[] };
};

export const UpdateUserDevsQuery = gql`
  mutation UserDevsUpdate($userId: String!, $devs: [String!]) {
    userDevsUpdate(by: { userId: $userId }, input: { devs: $devs }) {
      userDevs {
        devs
        userId
        id
      }
    }
  }
`;

export type UpdateUserDevsQueryResult = {
  userDevs: { userId: string; id: string; devs: string[] };
};
