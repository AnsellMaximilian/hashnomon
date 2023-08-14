import { Dev, DevQueryResult, GetDevQuery } from "@/lib/services/devs";
import { useQuery } from "@apollo/client";
import React from "react";
import { AiOutlineLoading3Quarters as LoadIcon } from "react-icons/ai";
import logo from "@/assets/images/logo.svg";
import Image from "next/image";
import {
  GetUserMovesQuery,
  GetUserMovesQueryResult,
  Move,
} from "@/lib/services/moves";

export default function HashnodexEntry({
  username,
  setSelectedDev,
  setSelectedDevMoves,
}: {
  username: string;
  setSelectedDev: React.Dispatch<React.SetStateAction<Dev | null>>;
  setSelectedDevMoves: React.Dispatch<React.SetStateAction<Move[]>>;
}) {
  const { loading, error, data } = useQuery<DevQueryResult>(GetDevQuery, {
    variables: {
      username: username,
    },
  });

  const {
    data: moves,
    loading: movesLoading,
    error: movesError,
  } = useQuery<GetUserMovesQueryResult>(GetUserMovesQuery, {
    variables: {
      // @ts-ignore
      userId: data?.hashnode.user._id,
    },
    skip: !data,
  });
  const setDev = () => {
    if (data) setSelectedDev(data.hashnode.user);
    if (moves)
      setSelectedDevMoves(moves.userMoves.moves.edges.map((edge) => edge.node));
  };
  return (
    <button
      className="p-4 bg-white shadow-md rounded-md hover:bg-light block col-span-6"
      onMouseOver={setDev}
      onClick={setDev}
    >
      {loading && <LoadIcon className="animate-spin" />}
      {data && (
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Logo" className="w-8 aspect-square" />
          <div>{data.hashnode.user.username}</div>
        </div>
      )}
    </button>
  );
}
