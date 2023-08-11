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
