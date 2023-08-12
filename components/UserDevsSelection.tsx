import { Dev, DevQueryResult, GetDevQuery } from "@/lib/services/devs";
import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import DevCard from "./DevCard";
import { AiOutlineLoading3Quarters as LoadIcon } from "react-icons/ai";

interface Props {
  devUsernames: string[];
  setUserDev: React.Dispatch<React.SetStateAction<Dev | null>>;
  dev: Dev | null;
}
export default function UserDevsSelection({
  devUsernames,
  setUserDev,
  dev,
}: Props) {
  const [getDev, { loading, error, data }] =
    useLazyQuery<DevQueryResult>(GetDevQuery);

  return (
    <div className="flex-1 p-4 flex flex-col">
      {dev ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="mb-2 text-2xl font-bold">Selected Dev</div>
            <button
              className="px-2 py-1 bg-white border-2 border-primary rounded-md text-primary font-bold hover:bg-dark"
              onClick={() => setUserDev(null)}
            >
              Change
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center w-full">
            <DevCard dev={dev} />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 justify-center items-center flex-1">
          <div className="font-bold text-lg flex gap-2 items-center">
            <span>Choose your Dev</span>
            {loading && <LoadIcon className="animate-spin" />}
          </div>
          <ul className="flex flex-col gap-2 w-full">
            {devUsernames.map((username) => (
              <li key={username}>
                <button
                  disabled={loading}
                  onClick={() => {
                    getDev({
                      variables: { username: username },
                      onCompleted: (data) => setUserDev(data.hashnode.user),
                    });
                  }}
                  className="bg-light px-4 py-2 shadow-md w-full hover:bg-primary hover:text-white font-bold rounded-md text-primary"
                >
                  {username}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
