import { gql } from "@apollo/client";

export type MoveType = "POWER_UP" | "DEFENSE" | "ATTACK" | "VIRUS";

export type Move = {
  name: string;
  description: string;
  type: MoveType;
  targetStat: "STRENGTH" | "SPEED" | "DEFENSE";
  power: number;
  reflective: boolean;
  continuous: boolean;
  id: string;
};

export type GetUserMovesQueryResult = {
  userMoves: { userId: string; id: string; moves: { edges: { node: Move }[] } };
};

export type GetMovesQueryResult = {
  moveCollection: { edges: { node: Move }[] };
};

export const GetMovesQuery = gql`
  query MoveCollection {
    moveCollection(first: 100) {
      edges {
        node {
          id
          name
          description
          type
          targetStat
          power
          reflective
          continuous
        }
      }
    }
  }
`;

export const GetUserMovesQuery = gql`
  query GetUserMoves($userId: String!) {
    userMoves(by: { userId: $userId }) {
      userId
      id
      moves(first: 4) {
        edges {
          node {
            name
            description
            type
            targetStat
            power
            reflective
            continuous
            id
          }
        }
      }
    }
  }
`;

export type CreateUserMovesQueryResult = {
  userMoves: { userId: string; id: string; moves: { edges: { node: Move }[] } };
};

export const CreateUserMovesQuery = gql`
  mutation UserMovesCreate(
    $moveId1: ID!
    $moveId2: ID!
    $moveId3: ID!
    $moveId4: ID!
    $userId: String!
  ) {
    userMovesCreate(
      input: {
        userId: $userId
        moves: [
          { link: $moveId1 }
          { link: $moveId2 }
          { link: $moveId3 }
          { link: $moveId4 }
        ]
      }
    ) {
      userMoves {
        userId
        moves(first: 100) {
          edges {
            node {
              name
              description
              type
              targetStat
              power
              continuous
              reflective
            }
          }
        }
      }
    }
  }
`;
